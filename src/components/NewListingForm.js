import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { BACKEND_URL } from "../constants";

const NewListingForm = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [shippingDetails, setShippingDetails] = useState("");
  const navigate = useNavigate();

  const { isAuthenticated, getAccessTokenSilently, loginWithRedirect, user } =
    useAuth0();

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    }
  });

  const handleChange = (event) => {
    switch (event.target.name) {
      case "title":
        setTitle(event.target.value);
        break;
      case "category":
        setCategory(event.target.value);
        break;
      case "condition":
        setCondition(event.target.value);
        break;
      case "price":
        setPrice(event.target.value);
        break;
      case "description":
        setDescription(event.target.value);
        break;
      case "shippingDetails":
        setShippingDetails(event.target.value);
        break;
      default:
    }
  };

  const handleSubmit = async (event) => {
    // Prevent default form redirect on submission
    event.preventDefault();

    const accessToken = await getAccessTokenSilently({
      audience: "https://carousell/api",
      scope: "read:current_user",
    });

    // Send request to create new listing in backend
    const response = await axios.post(
      `${BACKEND_URL}/listings`,
      {
        title,
        category,
        condition,
        price,
        description,
        shippingDetails,
        sellerEmail: user.email,
        sellerFirstName: user.given_name,
        sellerLastName: user.family_name,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log(user);
    // Clear form state
    setTitle("");
    setCategory("");
    setCondition("");
    setPrice(0);
    setDescription("");
    setShippingDetails("");

    // Navigate to listing-specific page after submitting form
    navigate(`/listings/${response.data.id}`);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
          placeholder="iPhone 13, like new!"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Category</Form.Label>
        <Form.Control
          type="text"
          name="category"
          value={category}
          onChange={handleChange}
          placeholder="Electronics"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Condition</Form.Label>
        <Form.Control
          type="text"
          name="condition"
          value={condition}
          onChange={handleChange}
          placeholder="Like New"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Price ($)</Form.Label>
        <Form.Control
          type="text"
          name="price"
          value={price}
          onChange={handleChange}
          placeholder="999"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={description}
          onChange={handleChange}
          placeholder="Bought 2 months ago, selling because switching to Android."
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Shipping Details</Form.Label>
        <Form.Control
          as="textarea"
          name="shippingDetails"
          value={shippingDetails}
          onChange={handleChange}
          placeholder="Same day shipping, we can message to coordinate!"
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        List this item
      </Button>
    </Form>
  );
};

export default NewListingForm;
