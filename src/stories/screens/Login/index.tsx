import * as React from "react";
import {Image, Platform, TextInput} from "react-native";
import {Item, List, ListItem, Container, Content, Header, Body, Title, Button, Text, View, Footer} from "native-base";

// import styles from "./styles";
export interface Props {
	loginForm: any;
	onLogin: Function;
}

export interface State {
	open: boolean;
	data: Array<number>;
	message: string;
}

const ws = new WebSocket("ws://nodechat2018.herokuapp.com/");

class Login extends React.Component<Props, State> {
	constructor(props?: any, context?: any) {
		super(props, context);

		this.state = {
			open: false,
			data: [],
			message: "",
		};

		console.log("This is client side Web socket.", ws.protocol);
		ws.onopen = () => {
			console.log("Its connected");
		};
		let that:any = this;
		ws.onmessage = function (message) {
			// a message was received
			let json: any;
			try {
				json = JSON.parse(message.data);
			} catch (e) {
				console.log("This doesn\'t look like a valid JSON: ", message.data);
				return;
			}


			console.log(json);
			if (json.type === 'color') {

			} else if (json.type === 'history') { // entire message history
				// insert every single message to the chat window
				for (var i = 0; i < json.data.length; i++) {
					addMessage(json.data[i]);
				}
			} else if (json.type === 'message') { // it's a single message
				addMessage(json.data);
			} else {
				console.log('Hmm..., I\'ve never seen JSON like this: ', json);
			}

		};

		function addMessage(data) {
			// var arrayvar = this.state.data.slice()
			// arrayvar.push(data)
			// this.setState({ data: arrayvar })

			let arrayvar = that.state.data.slice();
			arrayvar.push(data);
			that.setState({ data: arrayvar });
		}

		ws.onerror = (e) => {
			// an error occurred
			console.log(e);
		};

		ws.onclose = (e) => {
			// connection closed
			console.log(e.code, e.reason);
		};
	}

	_pushMessage() {
		if (!this.state.message)
			return;

		// this.state.data.messages.push({id: this.state.data.messages.length, time: 0, type: 'out', text: this.state.message});
		// this.setState({message: ''});
		// this._scroll(true);

		ws.send(this.state.message); // send a message
	}

	render() {

		return (
			<Container>
				<Header>
					<Body style={{alignItems: "center"}}>
					<Title>ReactNative</Title>
					<View padder>
						<Text style={{color: Platform.OS === "ios" ? "#000" : "#FFF"}}/>
					</View>
					</Body>
				</Header>
				<Content>
					<List dataArray={this.state.data}
						  renderRow={(item) =>
							  <ListItem>
								  <Text>{item.text}</Text>
							  </ListItem>
						  }>
					</List>

					<View padder>
						<Item rounded>
							<TextInput value={this.state.message}
									   onChangeText={(text) => this.setState({message: text})}>
							</TextInput>
						</Item>
						<Button block onPress={() => this._pushMessage()}>
							<Text>Enviar</Text>
						</Button>
					</View>
				</Content>
				<Footer style={{backgroundColor: "#F8F8F8"}}>
					<View style={{alignItems: "center", opacity: 0.5, flexDirection: "row"}}>
						<View padder>
							<Text style={{color: "#000"}}>Made with love at </Text>
						</View>
						<Image
							source={{uri: "https://geekyants.com/images/logo-dark.png"}}
							style={{width: 422 / 4, height: 86 / 4}}
						/>
					</View>
				</Footer>
			</Container>
		);
	}
}

export default Login;
