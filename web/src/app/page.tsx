"use client";

import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";

import CaliforniaMap from "@/components/Map";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <main className="flex flex-col">
      <section className="flex min-h-screen">
        <CaliforniaMap onSetMarker={onSetMarker} />
      </section>

      <section className="z-10 flex flex-col gap-2 absolute top-1/2 right-6 transform -translate-y-1/2">
        <Card>
          <CardBody>
            <p className="mb-4 text-[#8d8d8d]">
              Click on the map to select a location
            </p>

            <form
              className="flex flex-col gap-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                size="sm"
                type="number"
                label="Housing median age"
                {...register("housing_median_age", { required: true })}
              />
              <Input
                size="sm"
                type="number"
                label="Total rooms"
                {...register("total_rooms", { required: true })}
              />
              <Input
                size="sm"
                type="number"
                label="Total bedrooms"
                {...register("total_bedrooms", { required: true })}
              />
              <Input
                size="sm"
                type="number"
                label="Population"
                {...register("population", { required: true })}
              />
              <Input
                size="sm"
                type="number"
                label="Households"
                {...register("households", { required: true })}
              />
              <Input
                size="sm"
                type="number"
                label="Median income"
                {...register("median_income", { required: true })}
              />
              <Input
                size="sm"
                type="number"
                label="Median house value"
                {...register("median_house_value", { required: true })}
              />
              <Select
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
                Enviar
              </Button>
            </form>
          </CardBody>
        </Card>

        {prediction ? (
          <Card id="prediction" className="flex p-2">
            <strong>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(prediction)}
            </strong>
          </Card>
        ) : null}
      </section>

      {prediction ? (
        <section id="prediction" className="flex min-h-screen">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(prediction)}
        </section>
      ) : null}
    </main>
  );
}
