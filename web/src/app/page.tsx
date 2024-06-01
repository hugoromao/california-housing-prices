"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";

import CaliforniaMap from "@/components/Map";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Inputs = {
  longitude: number;
  latitude: number;
  housing_median_age: number;
  total_rooms: number;
  total_bedrooms: number;
  population: number;
  households: number;
  median_income: number;
  median_house_value: number;
  ocean_proximity: string;
};

export default function Home() {
  const { push } = useRouter();
  const { handleSubmit, register, setValue } = useForm<Inputs>({
    defaultValues: {
      housing_median_age: 28,
      total_rooms: 2635,
      total_bedrooms: 537,
      population: 1425,
      households: 499,
      median_income: 3,
      median_house_value: 206855,
      ocean_proximity: "<1H OCEAN",
    },
  });

  const [prediction, setPrediction] = useState();

  function onSetMarker(p: { longitude: number; latitude: number }) {
    setValue("longitude", p.longitude);
    setValue("latitude", p.latitude);
  }

  async function onSubmit({
    longitude,
    latitude,
    housing_median_age,
    total_rooms,
    total_bedrooms,
    population,
    households,
    median_income,
    median_house_value,
    ocean_proximity,
  }: Inputs) {
    try {
      if (!longitude && !latitude) {
        window.alert("Please, select a location on the map.");
        return null;
      }
      const features = [
        longitude,
        latitude,
        housing_median_age,
        total_rooms,
        total_bedrooms,
        population,
        households,
        median_income,
        median_house_value,
        ocean_proximity,
      ];

      const response = await fetch(`http://127.0.0.1:5000/predict`, {
        method: "POST",
        body: JSON.stringify({ features }),
      });
      const responseBody = await response.json();
      setPrediction(responseBody.prediction);
    } catch (err) {
      window.alert(err);
    }
  }

  return (
    <main className="flex flex-col px-4 py-6 max-w-2xl mx-auto gap-4">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">California Housing Prices</h1>
        <p>A regression model to predict the median house prices for California districts derived from the 1990 census.</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2>Context</h2>
        <p>This is the project developed in the second chapter of Aurélien Géron's recent book <em>'Hands-On Machine learning with Scikit-Learn and TensorFlow'</em>.</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="mb-2">Project pipeline</h2>
        <img src='/pipeline.png' />
      </section>


      <section className="flex flex-col gap-2 ">
        <h2 className="mb-4">Try on-line</h2>
        <form
          className="flex flex-col gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <CaliforniaMap onSetMarker={onSetMarker} />
          <p className="mb-4 text-gray-400 text-sm">
            *Click on the map to select a location.
          </p>
          <p className="mb-4 text-gray-400 text-sm">
            *These are the default values, but you can change each feature.
          </p>

          <Input
            variant="faded"
            size="sm"
            type="number"
            label="Housing median age"
            {...register("housing_median_age", { required: true })}
          />
          <Input
            variant="faded"
            size="sm"
            type="number"
            label="Total rooms"
            {...register("total_rooms", { required: true })}
          />
          <Input
            variant="faded"
            size="sm"
            type="number"
            label="Total bedrooms"
            {...register("total_bedrooms", { required: true })}
          />
          <Input
            variant="faded"
            size="sm"
            type="number"
            label="Population"
            {...register("population", { required: true })}
          />
          <Input
            variant="faded"
            size="sm"
            type="number"
            label="Households"
            {...register("households", { required: true })}
          />
          <Input
            variant="faded"
            size="sm"
            type="number"
            label="Median income"
            {...register("median_income", { required: true })}
          />
          <Input
            variant="faded"
            size="sm"
            type="number"
            label="Median house value"
            {...register("median_house_value", { required: true })}
          />
          <Select
            variant="faded"
            label="Ocean proximity"
            {...register("ocean_proximity", { required: true })}
          >
            <SelectItem key={"<1H OCEAN"}>{"<1H OCEAN"}</SelectItem>
            <SelectItem key={"INLAND"}>INLAND</SelectItem>
            <SelectItem key={"NEAR OCEAN"}>NEAR OCEAN</SelectItem>
            <SelectItem key={"NEAR BAY"}>NEAR BAY</SelectItem>
            <SelectItem key={"ISLAND"}>ISLAND</SelectItem>
          </Select>
          <Button type="submit" variant="solid" color="primary">
            Predict
          </Button>
        </form>

        {prediction ? (
          <Card id="prediction" className="flex p-2 text-center">
            <p>The median house prices for this district is:</p>
            <strong className="text-2xl">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(prediction)}
            </strong>
          </Card>
        ) : null}
      </section>


      <section className="flex flex-col gap-2">
        <h2>Evaluation</h2>
        <Card>
          <CardHeader>Root Mean Squared Error</CardHeader>
          <CardBody>
            <code>41549.20158097943</code>
          </CardBody>
        </Card>
      </section >
    </main>
  );
}
