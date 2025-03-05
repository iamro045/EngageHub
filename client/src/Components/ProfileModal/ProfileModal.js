import { Modal, useMantineTheme } from '@mantine/core';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { uploadImage } from '../../actions/UploadAction';
import { updateUser } from '../../actions/UserAction';

function ProfileModal({ modalOpened, setModalOpened, data }) {
  const theme = useMantineTheme();
  const { password, ...other } = data;
  const [formData, setFormData] = useState(other);
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const dispatch = useDispatch();
  const param = useParams();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];
      if (event.target.name === 'profileImage') {
        setProfileImage(img);
      } else {
        setCoverImage(img);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let userData = { ...formData };

    try {
      if (profileImage) {
        const profileData = new FormData();
        const profileFileName = Date.now() + profileImage.name;
        profileData.append('name', profileFileName);
        profileData.append('file', profileImage);
        userData.profilePicture = profileFileName;

        await dispatch(uploadImage(profileData));
      }

      if (coverImage) {
        const coverData = new FormData();
        const coverFileName = Date.now() + coverImage.name;
        coverData.append('name', coverFileName);
        coverData.append('file', coverImage);
        userData.coverPicture = coverFileName;

        await dispatch(uploadImage(coverData));
      }

      await dispatch(updateUser(param.id, userData));
      setModalOpened(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        size="55%"
        overlayProps={{
          color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}
      >
        <form className="infoForm" onSubmit={handleSubmit}>
          <h3>Update Your Info</h3>

          <div>
            <input
              type="text"
              placeholder="First Name"
              className="infoInput"
              name="firstname"
              onChange={handleChange}
              value={formData.firstname || ''}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="infoInput"
              name="lastname"
              onChange={handleChange}
              value={formData.lastname || ''}
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Works At"
              className="infoInput"
              name="worksAt"
              onChange={handleChange}
              value={formData.worksAt || ''}
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Lives in"
              className="infoInput"
              name="livesin"
              onChange={handleChange}
              value={formData.livesin || ''}
            />
            <input
              type="text"
              placeholder="Country"
              className="infoInput"
              name="country"
              onChange={handleChange}
              value={formData.country || ''}
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Relationship Status"
              className="infoInput"
              name="relationship"
              onChange={handleChange}
              value={formData.relationship || ''}
            />
          </div>

          <div>
            <h5>Profile Image</h5>
            <input type="file" name="profileImage" onChange={onImageChange} />
            <h5>Cover Image</h5>
            <input type="file" name="coverImage" onChange={onImageChange} />
          </div>

          <button className="button infoButton" type="submit">
            Update
          </button>
        </form>
      </Modal>
    </>
  );
}

export default ProfileModal;
