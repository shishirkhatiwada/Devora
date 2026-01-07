"use client";


import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const projects = useQuery(api.projects.get);
  const creatreProject = useMutation(api.projects.create);
  return (
    <div className="flex flex-col gap-4 p-4">
      <Button onClick={()=> creatreProject({
         name: "New Project"
      })}>
       Add New 
      </Button>
      {projects?.map((project)=>(
        <div className="border rounded p-2 flex flex-col" key={project._id}>
          <p> Project : {project.name}</p>
          <p> Owner :  {project.ownerId}</p>
        </div>
      ))}
    </div>
  );
}
