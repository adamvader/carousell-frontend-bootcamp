import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useAuth0 } from "@auth0/auth0-react";

import { BACKEND_URL } from "../constants.js";

const Listing = () => {
  const [listingId, setListingId] = useState();
  const [listing, setListing] = useState({});

  const { isAuthenticated, getAccessTokenSilently, loginWithRedirect, user } =
    useAuth0();

  useEffect(() => {
    // If there is a listingId, retrieve the listing data
    if (listingId) {
      axios.get(`${BACKEND_URL}/listings/${listingId}`).then((response) => {
        setListing(response.data);
      });
    }
    // Only run this effect on change to listingId
  }, [listingId]);

  // Update listing ID in state if needed to trigger data retrieval
  const params = useParams();
  if (listingId !== params.listingId) {
    setListingId(params.listingId);
  }

  // Store a new JSX element for each property in listing details
  const listingDetails = [];
  if (listing) {
    for (const key in listing) {
      listingDetails.push(
        <Card.Text key={key}>{`${key}: ${listing[key]}`}</Card.Text>
      );
    }
  }

  const handleClick = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    const accessToken = await getAccessTokenSilently({
      audience: "https://carousell/api",
      scope: "read:current_user",
    });

    const response = await axios.put(
      `${BACKEND_URL}/listings/${listingId}`,
      { buyerEmail: user.email },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    setListing(response.data);
  };

  return (
    <div>
      <Link to="/">Home</Link>
      <Card bg="dark">
        <Card.Body>
          {listingDetails}
          <Button onClick={handleClick} disabled={listing.BuyerId}>
            Buy
          </Button>
        </Card.Body>
      </Card>
      <br />
    </div>
  );
};

export default Listing;
