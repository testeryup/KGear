import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import axios, { type AxiosResponse } from 'axios'
import Button from './components/button';

function App() {
  // const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AxiosResponse<any> | null>(null);
  const fetchBackend = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://localhost:7211/weatherforecast");
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
    <div className='flex justify-center items-center h-screen flex-col'>
      <Button  onClick={onClick}>Click me!s</Button>
      {
        loading ? <div>
          Loading...
        </div>
          :
          <div>
            <pre className='font-bold underline'>{JSON.stringify(response, null, 2)}</pre>
          </div>
      }
    </div>
  )
}

export default App
