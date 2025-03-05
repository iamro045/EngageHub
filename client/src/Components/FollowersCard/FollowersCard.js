import React, { useEffect, useState } from 'react';
import './FollowersCard.css';
import UserFollow from '../UserFollow/UserFollow';
import { useSelector } from 'react-redux';
import { getAllUser } from '../../api/UserRequest';

const FollowersCard = () => {
  const [persons, setPersons] = useState([]);
  const { user } = useSelector((state) => state.authReducer.authData);

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const { data } = await getAllUser();
        setPersons(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchPersons();
  }, []);

  return (
    <div className='FollowersCard'>
      <h3>People you may know...</h3>
      {persons
        .filter((person) => person._id !== user._id) // Filters out the current user
        .map((person, id) => (
          <UserFollow person={person} key={id} />
        ))}
    </div>
  );
};

export default FollowersCard;
