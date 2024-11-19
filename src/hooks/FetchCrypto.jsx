import { useEffect, useState } from "react";
import axios from "axios";

export default function FetchCrypto(url, option, useLocalAPI = false) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const baseURL = useLocalAPI ? process.env.REACT_APP_LOCAL_API_URL : "";

  useEffect(() => {
    const fetchAsync = async () => {
      try {
        const response = await axios({
          url: baseURL ? `${baseURL}${url}` : url,
          method: "GET",
          headers: {
          },
          ...option,
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      }
    };
    fetchAsync();
  }, [url, baseURL]);

  return { loading, data, error };
}
