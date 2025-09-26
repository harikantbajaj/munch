import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import InterviewCard from "../Components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

const page = async () => {
  const user = await getCurrentUser();

  let userInterviews = null;
  let latestInterviews = null;

  if (user) {
    [userInterviews, latestInterviews] = await Promise.all([
      getInterviewsByUserId(user.id),
      getLatestInterviews({ userId: user.id }),
    ]);
  }

  const hasPastInterviews = userInterviews && userInterviews.interviews && userInterviews.interviews.length > 0;
  const hasLatestInterviews = latestInterviews && latestInterviews.interviews && latestInterviews.interviews.length > 0;
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get interview ready with AI-powered practice and feedback</h2>
          <p className="text-lg">
            Practice on real interview questions and get instant feedback
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Mock Interview</Link>
          </Button>
        </div>

        {/* TBD - CHANGE */}
        <Image
          src="/robot.png"
          alt="Robo dude"
          width={400}
          height={400}
          className="max-lg:hidden"
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button asChild className="btn-secondary">
            <Link href="/quiz">Quiz</Link>
          </Button>
          <Button asChild className="btn-secondary">
            <Link href="/code-compiler">Leetcode Hub</Link>
          </Button>
          <Button asChild className="btn-secondary">
            <Link href="/resume-analyzer">Resume Analyzer</Link>
          </Button>
          <Button asChild className="btn-secondary">
            <Link href="/chatbot">AI Chatbot</Link>
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your interviews</h2>
        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews!.interviews.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p></p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2></h2>
        <div className="interviews-section">
          {hasLatestInterviews ? (
            latestInterviews!.interviews.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p></p>
          )}
        </div>
      </section>
    </>
  );
};

export default page;
