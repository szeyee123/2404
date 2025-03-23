const AddressDetails = ({ address }) => (
  <div className="address-details">
    <h3>Address Details</h3>
    <p><strong>Street:</strong> {address.street}</p>
    <p><strong>City:</strong> {address.city}</p>
    <p><strong>Country:</strong> {address.country}</p>
    <p><strong>Zip Code:</strong> {address.zipcode}</p>
    {address.isDefault && <p className="default-tag">Default Address</p>}
  </div>
);

export default AddressDetails;