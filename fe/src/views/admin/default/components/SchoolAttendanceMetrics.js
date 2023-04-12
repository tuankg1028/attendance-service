// Chakra imports
import { Box, Flex, Text, Select, useColorModeValue } from "@chakra-ui/react";
import axios from "axios";

// Custom components
import Card from "components/card/Card.js";
import PieChart from "components/charts/PieChart";
import ApexCharts from "react-apexcharts";
import { pieChartData, pieChartOptions } from "variables/charts";
import { VSeparator } from "components/separator/Separator";
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import moment from "moment";
import io from "socket.io-client";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const socket = io(REACT_APP_API_URL);

export default function Conversion(props) {
  const { ...rest } = props;

  const [schoolAttendanceData, setSchoolAttendanceData] = useState([]);
  const [schools, setSchools] = useState([]);
  const [period, setPeriod] = useState("month");
  const [schoolId, setSchoolId] = useState(null);

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_API_URL}/api/attendance/school-metrics?period=${period}&schoolId=${schoolId}`
      );
      setSchoolAttendanceData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSchools = async () => {
    try {
      const response = await axios.get(`${REACT_APP_API_URL}/api/school`);
      setSchools(response.data.slice(0, 10));
      setSchoolId(response.data[0].id);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePeriodChange = (event) => {
    const period = event.target.value;
    setPeriod(period);
  };

  const handleSChoolChange = (event) => {
    setSchoolId(event.target.value);
  };

  socket.on("schoolAttendanceData", (schoolAttendance) => {
    setSchoolAttendanceData(schoolAttendance);
  });


  // Client side
  
  useEffect(() => {
    fetchSchools();
    // Disconnect the socket when the component unmounts
    return () => socket.disconnect();
  }, []);

  useEffect(async () => {
    if (schoolId) fetchAttendanceData();

    socket.emit("filterUpdated", {
      period,
      schoolId,
    });
  }, [period, schoolId]);

  const presentData = schoolAttendanceData.map((item) => item.present);
  const absentData = schoolAttendanceData.map((item) => item.absent);
  const categories = schoolAttendanceData.map((item) =>
    moment(item.date).format("YYYY-MM-DD").toString()
  );

  const options = {
    chart: {
      id: "attendance-chart",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories,
    },
    legend: {
      show: true,
      position: "top",
    },
  };

  const series = [
    {
      name: "Present",
      data: presentData,
    },
    {
      name: "Absent",
      data: absentData,
    },
  ];

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  return (
    <Card p="20px" align="center" direction="column" w="100%" {...rest}>
      <Flex
        px={{ base: "0px", "2xl": "10px" }}
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        mb="8px"
      >
        <Text color={textColor} fontSize="md" fontWeight="600" mt="4px">
          School attendance
        </Text>
        <Select
          onChange={handleSChoolChange}
          fontSize="sm"
          variant="subtle"
          defaultValue={schoolId}
          width="unset"
          fontWeight="700"
        >
          {schools.map((school) => (
            <option value={school.id}>{school.name}</option>
          ))}
        </Select>
        <Select
          onChange={handlePeriodChange}
          fontSize="sm"
          variant="subtle"
          defaultValue="month"
          width="unset"
          fontWeight="700"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </Select>
      </Flex>

      <ApexCharts options={options} series={series} type="bar" height={350} />
    </Card>
  );
}
