import { useState } from 'react';
import { Button, FlatList, Image, StyleSheet, Text, View } from 'react-native-web';

export default function App() {
  const [data, setData] = useState([]);
  const [locationNames, setLocationNames] = useState([]);

  const urlBase = 'https://pokeapi.co/api/v2/';

  const getPokemon = () => {
    const pokemonNames = ['charmander', 'bulbasaur', 'squirtle', 'pikachu', 'eevee', 'mudkip', 'mew'];
    const promises = pokemonNames.map((name) =>
      fetch(`${urlBase}pokemon/${name}`)
        .then((response) => response.json())
        .then((dataApi) => {
          return fetch(dataApi.location_area_encounters)
            .then((response) => response.json())
            .then((encounters) => {
              if (encounters.length > 0) {
                return fetch(encounters[0].location_area.url)
                  .then((response) => response.json())
                  .then((locationData) => ({
                    pokemon: dataApi,
                    location: locationData.name,
                  }));
              } else {
                throw new Error('No encounters found');
              }
            });
        })
    );

    Promise.all(promises)
      .then((results) => {
        setData(results.map((result) => result.pokemon));
        setLocationNames(results.map((result) => result.location));
      })
      .catch((error) => console.log(error));
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button onPress={getPokemon} title='Llamar Pokemones' />
      </View>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.containerPokemon}>
            <Text>Nombre: {item.name}</Text>
            <Text>
              Tipo:
              {item.types.map((type, index) => (
                <Text key={index}> {type.type.name}</Text>
              ))}
            </Text>
            <Text>Ubicación: {locationNames[index]}</Text>
            <Text>
              Habilidades:
              {item.abilities.map((ability, index) => (
                <Text key={index}> {ability.ability.name} </Text>
              ))}
            </Text>
            <View style={styles.containerPokeData}>
              <Image source={{ uri: item.sprites.front_default }} style={{ width: 100, height: 100 }} />
              <FlatList
                data={item.stats}
                keyExtractor={(stat, index) => index.toString()}
                renderItem={({ item }) => (
                  <Text>
                    {item.stat.name}: {item.base_stat}
                  </Text>
                )}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    backgroundColor: 'cyan',
    flexWrap: 'no wrap',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    textAlign: 'center',
  },
  containerPokemon: {
    margin: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    height: '90%',
    width: '90%',
    textAlign: 'center',
  },
  containerPokeData: {
    margin: 20,
    flexDirection: 'row',
    textAlign: 'center',
  },
});
