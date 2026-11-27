import type { Metadata } from "next";
import { FeedbackExperience } from "@/components/feedback/feedback-experience";

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "Tell Nano Spark how your workshop, kit or STEM lab program went. Rate your experience and help us build better learning for the next young innovator.",
};

export default function FeedbackPage() {
  return <FeedbackExperience />;
}
