require("dotenv").config();

import nodemailer from "nodemailer";
import {
  adminOnboardingMail,
  adminUnOnboardingDeleteMail,
  studentCreationMail,
} from "./mails-messages";

const currentYear = new Date().getFullYear().toString();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAILER_USERNAME,
    pass: process.env.MAILER_PASSWORD,
  },
});

const adminOnboardingMailOptions = ({
  email,
  name,
  link,
}: {
  email: string;
  name: string;
  link: string;
}) => {
  const options = {
    from: "TenaClass",
    to: email,
    subject: "Complete Your Onboarding - TenaClass",
    html: adminOnboardingMail(name, link, currentYear),
  };
  return options;
};

const adminUnOnboardingDeleteMailOptions = ({
  name,
  email,
  link,
}: {
  name: string;
  email: string;
  link: string;
}) => {
  const options = {
    from: "TenaClass",
    to: email,
    subject: "Your Account Has Been Deleted - TenaClass",
    html: adminUnOnboardingDeleteMail(name, link, currentYear),
  };
  return options;
};

const studentCreationMailOptions = ({
  name,
  email,
  password,
  link,
}: {
  name: string;
  email: string;
  password: string;
  link: string;
}) => {
  const options = {
    from: "TenaClass",
    to: email,
    subject: "Your Account Has Been Created - TenaClass",
    html: studentCreationMail(name, email, password, link, currentYear),
  };
  return options;
};

export {
  transporter,
  adminOnboardingMailOptions,
  adminUnOnboardingDeleteMailOptions,
  studentCreationMailOptions,
};
