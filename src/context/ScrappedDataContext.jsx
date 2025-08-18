import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ScrapedDataContext = createContext();

export const ScrapedDataProvider = ({ children }) => {
  const [scrapedData, setScrapedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScrapedData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:4001/api/scrape");
        if (response.data.success) {
          setScrapedData(response.data.data);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchScrapedData();
  }, []);

  return (
    <ScrapedDataContext.Provider value={{ scrapedData, loading, error }}>
      {children}
    </ScrapedDataContext.Provider>
  );
};
