import { useState, useEffect } from "react";

// Loại Country có thêm code, để dễ dàng tra cứu trong GeoNames
export type Country = {
  name: string;
  code: string;
};

type CountryAPIResponse = {
  name: { common: string };
  cca2: string;
};

type GeoNameCity = {
  name: string;
  population: number;
  fcode: string;
};

type GeoNamesResponse = {
  totalResultsCount: number;
  geonames: GeoNameCity[];
};

export function useCountryCityData() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Thay YOUR_USERNAME bằng username GeoNames của bạn
  const GEO_NAMES_USERNAME = "Tplanner";

  // Fetch danh sách countries từ RestCountries API (có thêm code)
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all");
        const data: CountryAPIResponse[] = await res.json();

        const countryList: Country[] = data
          .map((c) => ({ name: c.name.common, code: c.cca2 }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(countryList);
      } catch (err) {
        console.error("Failed to load countries", err);
        setError("Failed to load countries");
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Fetch danh sách thành phố sử dụng GeoNames API theo mã quốc gia
  const fetchCities = async (countryNameOrCode: string) => {
    setLoadingCities(true);
    setCities([]);
    setError(null);

    // Chúng ta sẽ dùng country code làm key trong localStorage để cache cities
    // Giả sử countryNameOrCode chính là mã quốc gia (vd: VN, US, ...) được truyền vào
    const cacheKey = `cities_${countryNameOrCode}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setCities(JSON.parse(cached));
      setLoadingCities(false);
      return;
    }

    try {
      const res = await fetch(
        `http://api.geonames.org/searchJSON?country=${countryNameOrCode}&featureClass=P&maxRows=1000&username=${GEO_NAMES_USERNAME}`
      );
      const data: GeoNamesResponse = await res.json();

      if (!data.geonames || data.geonames.length === 0) {
        setError("No cities found");
      } else {
        // Lọc chỉ lấy các thành phố có dân số trên một ngưỡng nhất định (vd: 50000)
        // Điều này giúp loại bỏ các huyện, thị xã nhỏ
        const filteredCities = data.geonames
          .filter((city) => city.population && city.population >= 50000)
          .map((city) => city.name);

        // Loại bỏ trùng lặp nếu có
        const uniqueCities = Array.from(new Set(filteredCities));
        setCities(uniqueCities);

        // Cache kết quả trong localStorage
        localStorage.setItem(cacheKey, JSON.stringify(uniqueCities));
      }
    } catch (err) {
      console.error("Failed to load cities", err);
      setError("Failed to load cities");
    } finally {
      setLoadingCities(false);
    }
  };

  return {
    countries,
    cities,
    loadingCountries,
    loadingCities,
    error,
    // Trong trường hợp này, ta truyền country code để fetch cities
    fetchCities,
  }
}
