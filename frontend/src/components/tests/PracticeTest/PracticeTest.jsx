import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../common/loadingSpinner';

const PracticeTest = () => {
  const { test_id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [counter, setCounter] = useState(1000000000);
  const [questions, setQuestions] = useState([]);
  const [cheatCount, setCheatCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const parseTime = (timeString) => {
    const [timePart, modifier] = timeString.split(' ');
    let [hours, minutes] = timePart.split(':');

    if (modifier === 'AM' && hours === '12') {
      hours = '00';
    } else if (modifier === 'PM' && hours !== '12') {
      hours = String(parseInt(hours, 10) + 12);
    }
    return `${hours}:${minutes}`;
  };

  const checkSubmission = async (test) => {
      try {
          const response = await axios.post(`/api/answers/submitted/${test._id}`);
          if (response.data) {
              toast.error("The test is already submitted.");
              return false;
          }
          return true;
      } catch (error) {
          return true;
      }
  };
  const correctTime = (test) => {
      const start = parseTime(test.start);
      const end = parseTime(test.end);
      const date = test.date.split("T")[0];
      const start_datetime = new Date(`${date}T${start}:00`);
      const end_datetime = new Date(`${date}T${end}:00`);
      const current_time = new Date();

      if (current_time < start_datetime) {
          toast.error('The test has not started yet. Please come back at the scheduled start time.');
          return false;
      } else if (current_time >= start_datetime && current_time <= end_datetime) {
          return true;
      } else {
          toast.error('The test has already ended. You can no longer participate.');
          return false;
      }
  };


  const Valid = async () => {
      try {
          const response = await axios.get(`/api/test/${test_id}`);
          const test = response.data;
          const timeValid = correctTime(test);
          const submitted = await checkSubmission(test);
          if (!timeValid || !submitted) {
              navigate(`/dashboard`);
          }

      } catch (error) {
          console.error("Error fetching test:", error);
          toast.error("Failed to fetch test details.");
      }
  };

  const handleCheatAttempt = async () => {
        setCheatCount((prev) => prev + 1);
        if (cheatCount + 1 >= 3) {
          await handleSubmit();
          toast.error('You have attempted to navigate away multiple times. The test has been submitted automatically.');
        } else {
          toast.error(`Navigation away detected. ${3 - cheatCount - 1} attempts left before auto-submission.`);
        }
      };
    
      useEffect(() => {
        const handleVisibilityChange = () => {
          if (document.hidden) handleCheatAttempt();
        };
    
        const handleResize = () => {
          handleCheatAttempt();
        };
    
        const preventConsole = () => {
          if (console && typeof console.log === 'function') {
            console.log = () => {
              handleCheatAttempt();
              toast.error('Console usage is restricted during the test.');
            };
          }
        };
    
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('resize', handleResize);
        preventConsole();
    
        return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          window.removeEventListener('resize', handleResize);
        };
      }, [cheatCount]);



  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        await Valid();
        const response = await axios.get(`/api/test/questions/${test_id}`);
        setQuestions(response.data.question);
        setLoading(false);
        const endTimeString = response.data.end;
        const parsedEndTime = parseTime(endTimeString);
        const endTime = new Date(`${new Date().toLocaleDateString()} ${parsedEndTime}`).getTime();

        const currentTime = Date.now();
        const remainingTimeInSeconds = Math.floor((endTime - currentTime) / 1000);

        setCounter(remainingTimeInSeconds > 0 ? remainingTimeInSeconds : 0);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [test_id]);

  useEffect(() => {
    const savedOptions = JSON.parse(localStorage.getItem(`selectedOptions-${test_id}`)) || {};
    const savedQuestionIndex = localStorage.getItem('currentQuestionIndex');

    setSelectedOptions(savedOptions);
    if (savedQuestionIndex) {
      setCurrentQuestion(parseInt(savedQuestionIndex, 10));
    }
  }, [test_id]);

  useEffect(() => {
    if (counter <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setCounter((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [counter]);

  const updateAnswer = async (questionIndex, answer) => {
    await Valid();
    try {
      await axios.put(`/api/answers/response/${test_id}`, {
        questionIndex,
        answer,
      });
    } catch (error) {
      console.error('Error updating answer:', error);
    }
  };

  const handleOptionSelect = async(optionIndex) => {
    await Valid();
    setSelectedOptions((prev) => {
      const updatedOptions = {
        ...prev,
        [currentQuestion]: optionIndex,
      };
      localStorage.setItem(`selectedOptions-${test_id}`, JSON.stringify(updatedOptions));
      return updatedOptions;
    });

    updateAnswer(currentQuestion, optionIndex);
  };

  const handleNext = async() => {
    await Valid();
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      localStorage.setItem('currentQuestionIndex', currentQuestion + 1);
    }
  };

  const handlePrevious = async() => {
    await Valid();
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      localStorage.setItem('currentQuestionIndex', currentQuestion - 1);
    }
  };

  const handleClear = async() => {
    await Valid();
    setSelectedOptions((prev) => {
      const updatedOptions = {
        ...prev,
        [currentQuestion]: null,
      };
      localStorage.setItem(`selectedOptions-${test_id}`, JSON.stringify(updatedOptions));
      return updatedOptions;
    });

    updateAnswer(currentQuestion, null);
  };

  const handleSubmit = async () => {
    await Valid();
    try {
      await axios.post(`/api/answers/submit/${test_id}`);
      toast.success('Test submitted successfully');
      localStorage.removeItem(`selectedOptions-${test_id}`);
      localStorage.removeItem('currentQuestionIndex');
      navigate("/");
    } catch (error) {
      toast.error('Error submitting test. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="text-white text-center">No questions available.</div>;
  }
  return (
    <div className="min-h-screen bg-gradient-to-l from-gray-800 to-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-gray-900 text-white p-6 rounded-md shadow-lg">
          {/* Countdown Timer */}
          <div className="grid grid-flow-col gap-5 text-center auto-cols-max mb-8">
            <div className="flex flex-col">
              <span className="countdown font-mono text-5xl">
                <span style={{ "--value": Math.floor((counter % 86400) / 3600) }}></span>
              </span>
              hours
            </div>
            <div className="flex flex-col">
              <span className="countdown font-mono text-5xl">
                <span style={{ "--value": Math.floor((counter % 3600) / 60) }}></span>
              </span>
              min
            </div>
            <div className="flex flex-col">
              <span className="countdown font-mono text-5xl">
                <span style={{ "--value": counter % 60 }}></span>
              </span>
              sec
            </div>
          </div>
  
          {/* Question Display */}
          <div className="mb-6">
            {questions[currentQuestion]?.img && (
              <img
                src={questions[currentQuestion].img}
                alt="Question visual"
                className="w-full h-full object-cover rounded-md mb-4"
              />
            )}
  
            <h2 className="text-2xl font-bold mb-4">{`Question ${currentQuestion + 1}: ${questions[currentQuestion].question}`}</h2>
  
            <div className="flex flex-col space-y-4">
              {questions[currentQuestion]?.options?.map((option, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={index}
                    checked={selectedOptions[currentQuestion] === index}
                    onChange={() => handleOptionSelect(index)}
                    className="radio radio-secondary bg-gray-800 border-gray-600 text-gray-300"
                  />
                  <span className="text-gray-300">{option.text}</span>
                  {option.img && (
                    <img
                      src={option.img}
                      alt="Option visual"
                      className="w-7/12 object-cover rounded-md mb-4"
                    />
                  )}
                </label>
              ))}
            </div>
          </div>
  
          {/* Buttons */}
          <div className="flex flex-col gap-4 md:flex-row justify-between items-center md:gap-8 mt-6">
            <button
              className="btn btn-outline bg-gray-800 hover:bg-gray-700 text-white w-full md:w-auto"
              onClick={handleClear}
              disabled={selectedOptions[currentQuestion] == null}
            >
              Clear Response
            </button>
  
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <button
                className="btn btn-outline bg-gray-800 hover:bg-gray-700 text-white w-full md:w-auto"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              <button
                className="btn btn-outline bg-gray-800 hover:bg-gray-700 text-white w-full md:w-auto"
                onClick={handleNext}
                disabled={currentQuestion === questions.length - 1}
              >
                Next
              </button>
              <button
                className="btn btn-success bg-green-600 hover:bg-green-500 text-white w-full md:w-auto"
                onClick={() => {
                  const confirmSubmit = window.confirm("Are you sure you want to submit the test?");
                  if (confirmSubmit) {
                    handleSubmit();
                  }
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PracticeTest;