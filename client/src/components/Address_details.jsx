import { Box, Typography } from "@mui/material";

function AddressDetails(address) {
  return (
    <Box 
      sx={{ 
        border: "1px solid #ddd", 
        borderRadius: 2, 
        p: 3, 
        boxShadow: 2, 
        backgroundColor: address.isDefault ? "#e3f2fd" : "#fff",
        maxWidth: 400,
        margin: "20px auto"
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Address Details
      </Typography>
      <Typography><strong>Street:</strong> {address.street}</Typography>
      <Typography><strong>City:</strong> {address.city}</Typography>
      <Typography><strong>Country:</strong> {address.country}</Typography>
      <Typography><strong>Zip Code:</strong> {address.zipcode}</Typography>

      {address.isDefault && (
        <Typography 
          variant="body2" 
          sx={{ color: "green", fontWeight: "bold", mt: 1 }}
        >
          Default Address
        </Typography>
      )}
    </Box>
  );
}

export default AddressDetails;