import React from "react";

const Address_individual = ({ address, onEdit, onDelete, onSetDefault }) => {
    return (
        <div className="address-item">
          <p>{address.street}, {address.city}, {address.country} ({address.zipcode})</p>
          <p className={address.isDefault ? "default" : ""}>
            {address.isDefault ? "Default Address" : ""}
          </p>
          <button onClick={() => onEdit(address)}>Edit</button>
          <button className="delete" onClick={() => onDelete(address.id)}>Delete</button>
          {!address.isDefault && (
            <button className="set-default" onClick={() => onSetDefault(address.id)}>Set as Default</button>
          )}
        </div>
      );
    };

export default Address_individual;
