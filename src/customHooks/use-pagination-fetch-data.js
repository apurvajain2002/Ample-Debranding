import axios from "axios";
import { useEffect, useState } from "react";

const usePaginationFetchData = ({ urlPath, dependencyArray = [] }) => {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState()
  const fetchData = async () => {
    try {
      setLoading(() => true);
      setError(() => false);
      const { data } = await axios.get(urlPath);

      if (data && data.products) {
        setData(() => data.products);
        setTotalItems(() => data.total);
        setLoading(() => false);
      }
    } catch (err) {
      setError(() => true);
      setLoading(() => false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencyArray);

  return {
    data,
    setData,
    error,
    setError,
    loading,
    setLoading,
    totalItems,
    setTotalItems,
  };
};

export default usePaginationFetchData;
