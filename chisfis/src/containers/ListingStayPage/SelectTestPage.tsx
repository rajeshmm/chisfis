import { Tab } from "@headlessui/react";
import { PencilAltIcon } from "@heroicons/react/outline";
import React, { FC, Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import visaPng from "images/vis.png";
import mastercardPng from "images/mastercard.svg";
import Input from "shared/Input/Input";
import Label from "components/Label/Label";
import Textarea from "shared/Textarea/Textarea";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import NcImage from "shared/NcImage/NcImage";
import StartRating from "components/StartRating/StartRating";
import NcModal from "shared/NcModal/NcModal";
import Select from "shared/Select/Select";
import FormItem from "./FormItem";
import { Link } from "react-router-dom";
import Heading2 from "components/Heading/Heading2";
import { query, collection, where, getDocs } from "@firebase/firestore";
import { db } from "firebase";

export interface CheckOutPageProps {
  className?: string;
}

const CheckOutPage: FC<CheckOutPageProps> = ({ className = "" }) => {
  const renderSidebar = () => {
    return (
      <div className='w-full flex flex-col sm:rounded-2xl sm:border border-neutral-200 dark:border-neutral-700 space-y-6 sm:space-y-8 px-0 sm:p-6 xl:p-8'>
        <div className='flex flex-col sm:flex-row sm:items-center'>
          <div className='py-5  space-y-3'>
            <div>
              <h3 className='text-2xl font-semibold'>Day 5 Test to Release</h3>
              <span className='text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1'>
                DAM Health
              </span>
              <span className='text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1'>
                Liverpool Location
              </span>
            </div>
            <span className='block  text-sm text-neutral-500 dark:text-neutral-400'>
              2 Members
            </span>
            <div className='w-10 border-b border-neutral-200  dark:border-neutral-700'></div>
          </div>
        </div>
        <div className='flex flex-col space-y-4'>
          <h3 className='text-2xl font-semibold'>Price detail</h3>
          <div className='flex justify-between text-neutral-6000 dark:text-neutral-300'>
            <span>19 x 2 members</span>
            <span>38</span>
          </div>
          <div className='flex justify-between text-neutral-6000 dark:text-neutral-300'>
            <span>Service charge</span>
            <span>5</span>
          </div>

          <div className='border-b border-neutral-200 dark:border-neutral-700'></div>
          <div className='flex justify-between font-semibold'>
            <span>Total</span>
            <span>38</span>
          </div>
        </div>
        <div className='pt-4'>
          <ButtonPrimary>Confirm and pay</ButtonPrimary>
        </div>
      </div>
    );
  };

  const history = useHistory();

  const journeyTypeOptions = [
    { value: "Hotel", label: "Departing (Pre-departure)" },
    { value: "Private room", label: "Returning (Pre-Return)" },
    { value: "Private room", label: "Already Arrived (After-Return)" },
  ];

  const [isLoaded, setIsLoaded] = useState(false);

  const [regionOptions, setRegionOptions] = useState([]);
  const [region, setRegion] = useState("United Kingdom");
  const [journeyType, setJourneyType] = useState("Departing");
  const [testTypeOptions, setTestTypeOptions] = useState([]);
  const [testType, setTestType] = useState("Day 2");

  useEffect(() => {
    getAllOptions();
  }, []);

  const getAllOptions = async () => {
    setIsLoaded(true);
    const q1 = query(collection(db, "bookatestdestinations"));
    const q2 = query(collection(db, "bookatesttypes"));
    const querySnapshot1 = await getDocs(q1);
    const querySnapshot2 = await getDocs(q2);
    let regions = [];
    let testTypes = [];
    querySnapshot1.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      regions.push(doc.data().location);
    });
    querySnapshot2.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      testTypes.push(doc.data().testType);
    });
    setRegionOptions(regions);
    setTestTypeOptions(testTypes);
    console.log(testTypes);
    setIsLoaded(false);
  };

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
  };
  const handleJourneyTypeChange = (e) => {
    setJourneyType(e.target.value);
  };
  const handleTestTypeChange = (e) => {
    setTestType(e.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    history.push({
      pathname: "/test-centers",
      state: { formData: { region: region, testType: testType } },
    });
  };

  const renderMain = () => {
    return (
      <>
        <Heading2
          heading='Which test do you need?'
          subHeading={
            <span className='block text-neutral-500 dark:text-neutral-400 mt-3'>
              Lets help you choose your test
            </span>
          }
        />
        {!isLoaded ? (
          <div className='w-full flex flex-col sm:rounded-2xl sm:border border-neutral-200 dark:border-neutral-700 space-y-8 px-0 sm:p-6 xl:p-8'>
            <form onSubmit={handleSubmit}>
              <div className='space-y-8'>
                {/* ITEM */}

                <FormItem
                  label='Select the region you will be taking your test in'
                  desc='Please select the country or region that you will be taking the test in, so that we can offer you the right services'>
                  <select
                    value={region}
                    onChange={handleRegionChange}
                    className={`nc-Select h-11 block w-full text-sm rounded-2xl border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900`}>
                    {regionOptions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </FormItem>
                <FormItem
                  label='Arriving or Departing'
                  desc='Are you going way, coming home or already back home?'>
                  <select
                    value={journeyType}
                    onChange={handleJourneyTypeChange}
                    className={`nc-Select h-11 block w-full text-sm rounded-2xl border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900`}>
                    {journeyTypeOptions.map((journeyType) => (
                      <option value={journeyType.value}>
                        {journeyType.label}
                      </option>
                    ))}
                  </select>
                </FormItem>
                <FormItem
                  label='Vaccination Status'
                  desc='Please tell us about your vaccination status'>
                  <Select>
                    <option value='Hotel'>Not Vaccinated</option>
                    <option value='Private room'>1 Dose</option>
                    <option value='Private room'>Fully Vaccinated</option>
                  </Select>
                </FormItem>
                <FormItem
                  label='Resident or Visitor'
                  desc='Where you a resident of the region or are you visiting?'>
                  <Select>
                    <option value='Resident'>Resident</option>
                    <option value='Visitor'>Visitor</option>
                  </Select>
                </FormItem>
                <FormItem
                  label='Center or Self-test'
                  desc='Where will you be taking the test?'>
                  <Select>
                    <option value='Self-test'>Self-test</option>
                    <option value='Center'>At a Test Center</option>
                  </Select>
                </FormItem>

                <FormItem
                  label='Test Type'
                  desc='We offer the full range of tests to depart out of as well as return from the region'>
                  <select
                    value={testType}
                    onChange={handleTestTypeChange}
                    className={`nc-Select h-11 block w-full text-sm rounded-2xl border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900`}>
                    {testTypeOptions.map((testType) => (
                      <option value={testType}>{testType}</option>
                    ))}
                  </select>
                </FormItem>
                <FormItem
                  label='Service Type'
                  desc='How fast do you want the results?'>
                  <Select>
                    <option value='Same Day'>
                      Same Day (Results by mid-night same day)
                    </option>
                    <option value='Next Day'>
                      Next Day (Results by mid-night next day)
                    </option>
                    <option value='Express'>
                      Express (Results in 1-3 hrs)
                    </option>
                    <option value='Hour'>
                      In an hour (Results in 60 mins)
                    </option>
                  </Select>
                </FormItem>
              </div>
              <div className='pt-4'>
                {/* <Link to='/test-centers'>
                <ButtonPrimary>Continue</ButtonPrimary>
              </Link> */}
                <ButtonPrimary type='submit'>Continue</ButtonPrimary>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ marginLeft: "50%" }} className='py-6'>
            <svg
              className='animate-spin -ml-1 mr-3 h-5 w-5'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'>
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='3'></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
            </svg>
          </div>
        )}
      </>
    );
  };

  return (
    <div className={`nc-CheckOutPage ${className}`} data-nc-id='CheckOutPage'>
      <main className='container mt-11 mb-24 lg:mb-32 flex flex-col-reverse lg:flex-row'>
        <div className='w-full lg:w-3/5 xl:w-2/3 lg:pr-10 '>{renderMain()}</div>
      </main>
    </div>
  );
};

export default CheckOutPage;
