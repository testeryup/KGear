import { useEffect, useState } from 'react'
import axios, { type AxiosResponse } from 'axios'
import Button from './components/button';
import { ProductForm } from './ProductForm';
function App() {
  // const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AxiosResponse<any> | null>(null);
  const fetchBackend = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://localhost:7111/weatherforecast");
      setResponse(response.data);
      console.log(response);
    } catch (error) {
      console.log("Error fetching data!");
    }
    finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchBackend();
  }, []);
  const onClick = () => {
    console.log("Clicked!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  }
  return (
    <ProductForm></ProductForm>
  )
}

export default App
