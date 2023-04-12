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

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

export default function Conversion(props) {
  const { ...rest } = props;

  const [feverEvent, setFeverEvent] = useState([]);

  const fetchFeverEventData = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_API_URL}/api/attendance/fever-events`
      );
      setFeverEvent(response.data.slice(0, 10));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFeverEventData();
  }, []);

  const events = feverEvent.map((item) => item.feverEventsCount);
  const categories = feverEvent.map((item) => item.school.name);

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
      name: "Hight Fever Event",
      data: events,
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
          High fever events
        </Text>
      </Flex>

      <ApexCharts options={options} series={series} type="bar" height={350} />
    </Card>
  );
}
