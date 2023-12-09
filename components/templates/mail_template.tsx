import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Html } from "@react-email/html";
import { Link } from "@react-email/link";
import React from "react";
import { Section } from "@react-email/section";
import { Tailwind } from "@react-email/tailwind";
import { Text } from "@react-email/text";
import { render } from "@react-email/render";

interface MailType {
    subject: string;
    body: string;
    callbackName: string;
    callbackUrl: string;
}

const MailTemplate = (props: MailType) => {
    const { subject, body, callbackName, callbackUrl } = props;

    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>{subject}</title>
            </Head>

            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                primary: "#2d3748",
                                secondary: "#f4f4f4",
                                dark: "#2d3748",
                            },
                        },
                    },
                }}
            >
                <Container className=" w-full bg-secondary font-sans">
                    <Section>
                        {/* email head section */}
                        <Section className="bg-primary text-center">
                            <Text className=" my-7 text-center text-xl font-bold text-white">
                                SEM GRADES
                            </Text>
                        </Section>

                        {/* email body section */}
                        <Section className=" bg-white">
                            <Text className="text-center font-semibold text-[#2d3748]">
                                {subject}
                            </Text>

                            <Text className="text-center text-[#5a5d62]">{body}</Text>

                            <Text className="my-7 text-center text-[#5a5d62]">
                                <Link
                                    className="  rounded  bg-primary p-2 text-white"
                                    href={callbackUrl}
                                >
                                    {callbackName}
                                </Link>
                            </Text>
                        </Section>

                        {/* footer section */}
                        <hr className="w-full" />
                        <Section className="">
                            <Text className="my-7 text-center text-[#2d3748]">
                                © 2023 #SEM GRADES. All rights reserved.
                            </Text>
                        </Section>
                    </Section>
                </Container>
            </Tailwind>
        </Html>
    );
};

const generateMailTemplate = (
    subject: string,
    body: string,
    callbackName: string,
    callbackUrl: string
): string => {
    return render(
        <MailTemplate
            subject={subject}
            body={body}
            callbackName={callbackName}
            callbackUrl={callbackUrl}
        />
    );
};

export default generateMailTemplate;
