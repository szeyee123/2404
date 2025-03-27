import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import http from '../http';
import "leaflet/dist/leaflet.css"; // Ensure Leaflet styles are imported

const DashboardMap = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);  // To handle loading state
  const [error, setError] = useState(null);  // To handle any errors

  useEffect(() => {
    http.get("/user/geocode")
      .then(response => {
        // Check if the response contains JSON
        if (response.headers['content-type']?.includes('application/json')) {
          console.log(response.data);  // Log the data to check its structure
          setData(response.data);
        } else {
          console.error("Expected JSON, but got:", response.data);
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
      })
      .finally(() => setLoading(false));  // Stop loading regardless of success or failure
  }, []);

  if (loading) {
    return <div>Loading map data...</div>;  // Display loading text
  }

  if (error) {
    return <div>{error}</div>;  // Display error message if there is one
  }

  return (
    <MapContainer
      center={[1.3521, 103.8198]} // Singapore center
      zoom={12}
      scrollWheelZoom={false}
      style={{ height: "500px", width: "100%" }} // Ensure proper height & width
    >
      <TileLayer
        url="https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png"
      />

      {/* Create a marker for each address */}
      {Array.isArray(data) && data.map((loc, index) => (
        loc.lat && loc.lon && (
          <Marker key={index} position={[loc.lat, loc.lon]}>
            <Popup>{loc.zipCode}</Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};

export default DashboardMap;
