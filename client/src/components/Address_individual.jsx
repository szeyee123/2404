const AddressIndividual = ({ address, onEdit, onDelete, onSetDefault }) => (
  <div className="address-item">
    <p>{address.street}, {address.city}, {address.country} ({address.zipcode})</p>
    {address.isDefault && <p className="default">Default Address</p>}
    <button onClick={() => onEdit(address)}>Edit</button>
    <button className="delete" onClick={() => onDelete(address.id)}>Delete</button>
    {!address.isDefault && (
      <button className="set-default" onClick={() => onSetDefault(address.id)}>Set as Default</button>
    )}
  </div>
);

export default AddressIndividual;