import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components';

const Container = styled.View`
    flex: 1;
    background-color: #fff;
    align-items: center;
    justify-content: center;
`;

const Title = styled.Text`
    font-size: 20px;
    margin-bottom: 10px;
`;

const RefreshText = styled.Text`
    margin-top: 10px;
`;

export default class App extends React.Component {
    constructor() {
        super();

        this.state = {
            lat: 0,
            lon: 0,
            counter: 100,
        };
    }

    componentDidUpdate() {
        if (this.state.counter <= 0) {
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                this.setState({
                    lat: coords.latitude,
                    lon: coords.longitude,
                    counter: 100,
                });
            });
        }
    }

    componentDidMount() {
        setInterval(() => {
            this.setState(state => ({
                counter: state.counter - 1,
            }));
        });
    }

    render() {
        return (
            <Container>
                <Title>Location</Title>
                <Text>lat: {this.state.lat}</Text>
                <Text>lon: {this.state.lon}</Text>
                <RefreshText>Refesh in {this.state.counter}ms</RefreshText>
            </Container>
        );
    }
}
