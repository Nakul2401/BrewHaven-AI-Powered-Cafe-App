import { StyleSheet, Text, View, Image, FlatList, StatusBar, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Product, ProductCategory } from '@/types/types'
import { fetchProducts } from '@/services/productService';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import SearchArea from '@/components/SearchArea';
import Banner from '@/components/Banner';
import { router } from 'expo-router';
import { useCart } from '@/components/CartContext';
import Toast from 'react-native-root-toast';

const Home = () => {

  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [shownProducts, setShownProducts] = useState<Product[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const uniqueCategories = Array.from((productCategories)).map((category) => ({
      id: category.id,
      selected: selectedCategory === category.id,
    }));
    setProductCategories(uniqueCategories);

    if (selectedCategory === 'All') {
      setShownProducts(products);
    } else {
      const filteredProducts = products.filter((product) => product.category === selectedCategory);
      setShownProducts(filteredProducts)
    }

  }, [selectedCategory])


  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await fetchProducts();

        const categories = productsData.map((product) => product.category);
        categories.unshift('All');

        const uniqueCategories = Array.from(new Set(categories)).map((category) => ({
          id: category,
          selected: selectedCategory === category,
        }));

        
        setProducts(productsData);
        setProductCategories(uniqueCategories);
        setShownProducts(productsData);
        // setProductCategories(uniqueCategories);

      } catch (err) {
        setError("Error fetching products"+err);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();

  }, [])

  if (loading) return <Text>Loading...</Text>
  if (error) return <Text>{error}</Text>;
  
  const addButton = (name:string) => {
    addToCart(name, 1);
    Toast.show(`${name} added to cart`, {
      duration: Toast.durations.SHORT,
    });
  };

  return (
    <GestureHandlerRootView>
      {/* <StatusBar barStyle="light-content" backgroundColor="#222222" /> */}
      <SafeAreaView className='w-full -mt-2 -mb-10'>
        <FlatList 
          horizontal={false}
          columnWrapperStyle={{ justifyContent: 'space-between', marginLeft: 15, marginRight: 15, marginTop: 5 }}
          numColumns={2}
          keyExtractor={(item,index) => index.toString()}
          data= {shownProducts}

          renderItem={({item}) => (
            <View
              className='w-[48%] mt-2 bg-white rounded-2xl p-2 flex justify-between'
            >
              <TouchableOpacity
                onPress = {() => {router.push({
                    pathname: '/details', params: {
                      name: item.name,
                      image_url: item.image_url,
                      type: item.category,
                      price: item.price,
                      image: item.image_url,
                      rating: item.rating,
                      description: item.description
                    }
                  })
                }}
              >
                <Image 
                  className='w-full h-32 rounded-2xl'
                  source={{uri: item.image_url}}
                />

                <Text
                  className='text-[#242424] text-lg font-[Sora-SemiBold] ml-1 mt-2'
                >
                  {item.name}
                </Text>

                <Text
                  className='text-[#A2A2A2] text-sm font-[Sora-Regular] ml-1'
                >
                  {item.category}
                </Text>

              </TouchableOpacity>

              <View
                className='flex-row justify-between ml-1 mt-2 mb-2 mr-1'
              >
                <Text
                  className='text-[#050505] text-xl font-[Sora-SemiBold] mt-2'
                >
                  ₹ {item.price}
                </Text>

                <TouchableOpacity
                  onPress={() => addButton(item.name)}
                >
                  <View
                    className='bg-[#C67C4E] rounded-xl p-3'
                  >
                    <AntDesign name="plus" size={20} color="white" />
                  </View>
                </TouchableOpacity>
              </View>

            </View>
          )}
          ListHeaderComponent = {() => (
            <View
              className = 'flex'
            >
              <SearchArea />
              <Banner />
              <View
              className='flex items-center'
            >
              <FlatList 
                className='mt-6 w-[90%] mb-2'
                data = {productCategories}
                horizontal={true}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => setSelectedCategory(item.id)}
                  >
                    <Text
                      className={`text-sm mr-4 font-[Sora-Regular] p-3 rounded-xl 
                        ${item.selected ? 'text-white' : 'text-[#313131]'}
                        ${item.selected ? 'bg-app_orange_color ' : 'bg-[#ECECEC] '}
                        `}
                      >{item.id}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default Home

// const styles = StyleSheet.create({})