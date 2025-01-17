import React, { useState } from 'react';
import { Styles } from './DailyRidesStyles'
import { SafeAreaView, Text, FlatList, TouchableOpacity, Linking } from 'react-native';

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[Styles.item, backgroundColor]}>
    <Text style={[Styles.title, textColor]}>{item.title}</Text>
    <Text style={[Styles.text, textColor]}>When: {item.date} </Text>
    <Text style={[Styles.text, textColor]}>Pace: {item.pace} </Text>
    <Text style={[Styles.text, textColor]}>Distance: {item.distance}</Text>
    <Text style={[Styles.text, textColor]}>{item.leader}</Text>
  </TouchableOpacity>
);

export default class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          selectedId: 0,
          data: [],
          refreshing: true,
      }
  }

  componentDidMount() {
      this.fetchRides();
  }

  fetchRides() {
      this.setState({ refreshing: true });

      fetch('https://cascade-api.herokuapp.com/calendar')
            .then((response) => response.json())
            .then((data) => {
              const dailyRides = data.map((element, index) => {
                if (index === 0) {
                    console.log(Object.keys(element));
                  }
                return {
                    id: index,
                    title: element.title,
                    url: element.url,
                    date: element.date,
                    pace: element.pace,
                    distance: element.distance,
                    leader: element.leader,
                    location: element.location,
                };
              });
              this.setState({ data: dailyRides });
              this.setState({ refreshing: false });
            }).catch(e => {
              this.setState({ data: [
                  {
                      id: 0,
                      title: e.toString()
                  }
              ]});
              this.setState({ refreshing: false });
              console.log(e);
            });
      }
      renderItemComponent = ({ item }) => {
        const backgroundColor = item.id === this.state.selectedId ? '#787a7d' : '#e1e3e6';
        const color = item.id === this.state.selectedId ? 'white' : 'black';
        
        return (
          <Item
            item={item}
            onPress={() => {this.setState({ selectedId : item.id });
              Linking.openURL('https://cascade.org'+ item.url);}
            }
            backgroundColor={{ backgroundColor }}
            textColor={{ color }}
          />
        );
      };

    handleRefresh = () => {
      this.setState({ refreshing: false }, () => { this.fetchRides() }); // call fetchRides after setting the state
    }

    render() {
      return (
      <SafeAreaView style={Styles.container}>
        <FlatList
          data={this.state.data}
          renderItem={item => this.renderItemComponent(item)}
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={this.ItemSeparator}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}
        />
      </SafeAreaView>          
      )
    }
};
