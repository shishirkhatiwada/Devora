"use client";

import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SparkleIcon } from "lucide-react";
import { Kbd } from "@/components/ui/kbd";
import { FaGithub } from "react-icons/fa";
import ProjectList from "./project-list";
import { useCreateProject } from "../hooks/use-project";



import {adjectives, animals, colors, uniqueNamesGenerator} from 'unique-names-generator';
import { useEffect, useState } from "react";
import { ProjectsCommandDialog } from "./projects-command-dialog";


const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const ProjectView = () => {
  const createProject = useCreateProject();

  const [CommandDialogOpen, setCommandDialogOpen] = useState(false);

    useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "k") {
          e.preventDefault();
          setCommandDialogOpen(true);
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <>
    <ProjectsCommandDialog open={CommandDialogOpen} onOpenChange={setCommandDialogOpen} />
    <div className="min-h-screen bg-sidebar flex flex-col items-center justify-center p-6 md:p-16">
      <div className="w-full max-w-sm mx-auto flex flex-col gap-4 items-center">
        <div className="flex items-center gap-2 w-full group/logo">
          <img
            src="/vercel.svg"
            alt="devora"
            className="size-[32px] md:size-[46px"
          />
          <h1
            className={cn(
              "relative inline-block text-3xl md:text-5xl font-bold text-foreground after:absolute after:left-0 after:-bottom-2 after:h-[3px] after:w-full after:bg-primary after:rounded-full after:shadow-[0_0_10px_hsl(var(--primary))]",
              font.className,
            )}
          >
            Devaura
          </h1>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={()=>{
                const projectName = uniqueNamesGenerator({
                    dictionaries: [adjectives, colors, animals],
                    separator: ' ',
                    style: 'capital',
                    length: 3
                });
                createProject({
                    name: projectName
                })
              }}
              className="h-full items-start justify-start p-4 bg-background border flex flex-col gap-6 rounded-none"
            >
              <div className="flex items-center justify-between">
                <SparkleIcon className="size-4" />
                <Kbd className="ml-2">⌨J </Kbd>
              </div>
              <div>
                <span className="text-sm">New</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-full items-start justify-start p-4 bg-background border flex flex-col gap-6 rounded-none"
            >
              <div className="flex items-center justify-between">
                <FaGithub className="size-4" />
                <Kbd className="ml-2">⌨ I </Kbd>
              </div>
              <div>
                <span className="text-sm">Import</span>
              </div>
            </Button>
          </div>
          <ProjectList onViewAll={() =>setCommandDialogOpen(true)} />
        </div>
      </div>
    </div>
    </>
  );
};

export default ProjectView;
