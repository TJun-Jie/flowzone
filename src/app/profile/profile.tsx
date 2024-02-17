"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import "./profile.css"

export type Profile = {};

const Profile: React.FC<Profile> = () => {
  const [profile, setProfile] = useState({ 
    name: "",
    gender: "",
    age: "",
    email: "",
    location: {city: "", state: "", country: ""},
    background: {education: "", occupation: "", maritalStatus: ""},
    preferences: [],
    goal: "",
    pastEvents: []
  });

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("")
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [education, setEducation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");

  // Load user's current data
  useEffect(() => {
    fetch('http://localhost:6002/getUserData')
      .then(response => response.json())
      .then(profile => {
          console.log(profile);
          setProfile(profile);
          setName(profile.name);
          setGender(profile.gender);
          setAge(profile.age);
          setEmail(profile.email);
          setCity(profile.location.city);
          setState(profile.location.state);
          setCountry(profile.location.country);
          setEducation(profile.background.education);
          setOccupation(profile.background.occupation);
          setMaritalStatus(profile.background.maritalStatus);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Prepare the data to be sent to the backend
    const profileData = { 
      name: name,
      gender: gender,
      age: age,
      email: email,
      location: {city: city, state: state, country: country},
      background: {education: education, occupation: occupation, maritalStatus: maritalStatus}
    };

    try {
      // Send data to your backend server
      console.log(JSON.stringify(profileData));
      const response = await fetch('http://localhost:6002/saveProfile', {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        console.log('Profile saved');
        console.log(response);
        // You can add additional actions here upon successful save
      } else {
        console.error('Failed to save profile');
      }
    } catch (error) {
    console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
            Name
          </label>
          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" value={name} onChange={e => setName(e.target.value)} id="grid-first-name" type="text" placeholder="Jane"/>
        </div>
        {/* <div className="w-full md:w-1/2 px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
            Last Name
          </label>
          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Doe"/>
        </div> */}
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
      <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-gender">
            Gender
          </label>
          <div className="relative">
            <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" value={gender} onChange={e => setGender(e.target.value)} id="grid-gender">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-age">
            Age
          </label>
          <div className="relative">
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" value={age} onChange={e => setAge(e.target.value)} type="number" id="number-input" placeholder=""/>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-marital-status">
            Marital Status
          </label>
          <div className="relative">
            <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" value={maritalStatus} onChange={e => setMaritalStatus(e.target.value)} id="grid-marital-status">
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="others">Others</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-education">
            Education
          </label>
          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" value={education} onChange={e => setEducation(e.target.value)} id="grid-education" type="text" placeholder="PhD"/>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-occupation">
            Occupation
          </label>
          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" value={occupation} onChange={e => setOccupation(e.target.value)} id="grid-occupation" type="text" placeholder="Software Engineer"/>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
            City
          </label>
          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" value={city} onChange={e => setCity(e.target.value)} id="grid-city" type="text" placeholder="Albuquerque"/>
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
            State
          </label>
          <div className="relative">
          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" value={state} onChange={e => setState(e.target.value)} id="grid-state" type="text" placeholder="New Mexico"/>
          </div>
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-country">
            Country
          </label>
          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" value={country} onChange={e => setCountry(e.target.value)} id="grid-country" type="text" placeholder="United States"/>
        </div>
      </div>
      <div className="md:flex md:items-center">
          <button className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
            Save Profile
          </button>
      </div>
    </form>
  );
}
  
  export default Profile;

    //   <div className="form-box">
    //   <form onSubmit={handleSubmit}>
    //     <label>
    //       Name:
    //       <input type="text" value={name} onChange={e => setName(e.target.value)} />
    //     </label>
    //     <br />
    //     <label>
    //       Gender:
    //       <select value={gender} onChange={e => setGender(e.target.value)}>
    //         <option value="">Select Gender</option>
    //         <option value="female">Male</option>
    //         <option value="male">Female</option>
    //         <option value="other">Other</option>
    //       </select>
    //     </label>
    //     <br/>
    //     <label>
    //       Age:
    //       <input type="number" value={age} onChange={e => setAge(e.target.value)} />
    //     </label>
    //     <br />
    //     <label>
    //       Email:
    //       <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
    //     </label>
    //     <br />
    //     <label>
    //       Address:
    //       <input type="text" value={address} onChange={e => setAddress(e.target.value)} />
    //     </label>
    //     <br />
    //     <label>
    //       City:
    //       <input type="text" value={city} onChange={e => setCity(e.target.value)} />
    //     </label>
    //     <br />
    //     <label>
    //       State:
    //       <input type="text" value={state} onChange={e => setState(e.target.value)} />
    //     </label>
    //     <br />
    //     <label>
    //       Country:
    //       <input type="text" value={country} onChange={e => setCountry(e.target.value)} />
    //     </label>
    //     <br />
    //     <label>
    //       Education:
    //       <input type="text" value={education} onChange={e => setEducation(e.target.value)} />
    //     </label>
    //     <br />
    //     <label>
    //       Occupation:
    //       <input type="text" value={occupation} onChange={e => setOccupation(e.target.value)} />
    //     </label>
    //     <br />
    //     <label>
    //       Marital Status:
    //       <select value={maritalStatus} onChange={e => setMaritalStatus(e.target.value)}>
    //         <option value="">Select Marital Status</option>
    //         <option value="single">Single</option>
    //         <option value="married">Married</option>
    //         <option value="divorced">Divorced</option>
    //         <option value="other">Other</option>
    //       </select>
    //     </label>
    //     <br />
    //     <button className="submit-button" type="submit">Save Profile</button>
    //   </form>
    // </div>