import React, { useState } from 'react';
import styles from './a.module.scss';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from "react-router-dom";

const CreateRoom = () => {

  const location = useLocation();
  const props = location.state;
  const navigate = useNavigate();

  const [communityName, setCommunityName] = useState(props?props.name:'');
  const [communityDescription, setCommunityDescription] = useState(props?props.description:'');
  const [communitySummary, setCommunitySummary] = useState(props?props.summary:'');
  const [linkedInLink, setLinkedInLink] = useState(props?props.linkedInLink:'');
  const [githubLink, setGithubLink] = useState(props?props.githubLink:'');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!communityName) newErrors.communityName = 'Community name is required';
    if (!communityDescription) newErrors.communityDescription = 'Community description is required';
    if (!communitySummary) newErrors.communitySummary = 'Community summary is required';
    if (!linkedInLink) newErrors.linkedInLink = 'LinkedIn link is required';
    if (!githubLink) newErrors.githubLink = 'GitHub link is required';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});

      fetch('http://localhost:4000/api/communities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({  
          name: communityName,
          description: communityDescription,
          summary: communitySummary,
          linkedInLink,
          githubLink,
          creator: JSON.parse(localStorage.getItem('user')).id,
        }),
      }).then((response) => {
        if (response.ok) {
          toast.success('Request submitted successfully');
          navigate('/studygroups');
        } else {
          alert('Failed to create community');
        }
      });

    }
  };

  const rejectCommunity = (e) => {
    e.preventDefault();
    fetch('http://localhost:4000/api/communities/'+props._id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.ok) {
        toast.success('Community removed from pending list');
        navigate('/studygroups');
      } else {
        alert('Failed to accept community');
      }
    });
  }

  const acceptCommunity = (e) => {
    e.preventDefault();
    fetch('http://localhost:4000/api/createroom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({  
        name: communityName,
        description: communityDescription,
        summary: communitySummary,
        linkedInLink,
        githubLink,
        creator: JSON.parse(localStorage.getItem('user')).id,
      }),
    }).then((response) => {
      if (response.ok) {
        rejectCommunity(e)
        toast.success('Community accepted');
        navigate('/studygroups');
      } else {
        alert('Failed to accept community');
      }
    });
  }

  return (
    <div className={styles.formContainer}>
      <h2>Community Details</h2>
      <form>
        <div className={styles.formGroup}>
          <label htmlFor="name">Community Name:</label>
          <input
            type="text"
            id="name"
            value={communityName}
            onChange={(e) => setCommunityName(e.target.value)}
          />
          {errors.communityName && <span className={styles.error}>{errors.communityName}</span>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Community Description:</label>
          <textarea
            id="description"
            value={communityDescription}
            onChange={(e) => setCommunityDescription(e.target.value)}
          />
          {errors.communityDescription && <span className={styles.error}>{errors.communityDescription}</span>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="summary">Community Summary:</label>
          <textarea
            id="summary"
            value={communitySummary}
            onChange={(e) => setCommunitySummary(e.target.value)}
          />
          {errors.communitySummary && <span className={styles.error}>{errors.communitySummary}</span>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="linkedin">LinkedIn Link:</label>
          <input
            type="text"
            id="linkedin"
            value={linkedInLink}
            onChange={(e) => setLinkedInLink(e.target.value)}
          />
          {errors.linkedInLink && <span className={styles.error}>{errors.linkedInLink}</span>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="github">GitHub Link:</label>
          <input
            type="text"
            id="github"
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
          />
          {errors.githubLink && <span className={styles.error}>{errors.githubLink}</span>}
        </div>
        {
          props?(
            <div>
              <button onClick={acceptCommunity} className={styles.submitButton} style={{background:'green'}}>Accept</button>
              <br></br>
              <button onClick={rejectCommunity} className={styles.submitButton} style={{background:'red'}}>Reject</button>
            </div>
          ):(
            <button onClick={handleSubmit} className={styles.submitButton}>Submit</button>
        )
        }
      </form>
    </div>
  );
};

export default CreateRoom;
