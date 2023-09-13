const PrivacyPolicyPage = () => {
  const renderIntroduction = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          Introduction
        </div>
        <div>
          In order to resolve a complaint regarding the Site or the Marketplace
          Offerings or to receive further information regarding the use of the
          Site or the Marketplace Offerings, please contact us at:
        </div>
      </div>
    );
  };

  const renderPurposesOfProcessing = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          Purposes of Processing
        </div>
        <div className="text-lg font-semibold">What is personal data?</div>
        <div>
          We gather various types of information, including personal data. In
          this Policy, &quot;personal data&quot; refers to any information that,
          either alone or in combination with other data we process about you,
          identifies you as an individual. This may include your name, mailing
          address, email address, and telephone number.
        </div>
        <div className="text-lg font-semibold">
          Why do we need your personal data?
        </div>
        <div>
          We process your personal data in compliance with applicable data
          protection and privacy laws. To grant you access to the website, we
          require specific personal data. When you registered with us, you
          consented to provide this information in order to use our services,
          purchase products, or view content. This consent serves as the legal
          basis for processing your data. You have the right to withdraw your
          consent at any time. If you do not agree with our use of your personal
          data outlined in this Policy, please refrain from using our website.
        </div>
      </div>
    );
  };

  const renderCollectionYourPersonalData = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          Collecting Your Personal Data
        </div>
        <div className="text-lg font-semibold">
          We collect information about you through the following methods:
        </div>
        <div>
          Information You Provide: This includes personal data you provide when
          registering on our website, such as your name, address, email address,
          telephone number, username, password, and demographic information
          (such as gender). It also includes any personal data included in
          videos, comments, or other submissions you upload or post on the
          website. Additionally, we collect personal data you provide when
          participating in our rewards program or other promotions, reporting
          issues with our website, making purchases, or corresponding with us
          through phone, email, or other means.
        </div>
        <div>
          Information from Social Networking Websites: Our website features
          interfaces that enable you to connect with social networking sites
          (SNS). If you connect to an SNS through our website, you authorize us
          to access, use, and store the information permitted by the SNS based
          on your settings. We will handle this information in accordance with
          this Policy. You can revoke our access to your SNS information at any
          time by adjusting your account settings on the respective SNS.
        </div>
        <div>
          Automatically Collected Information: When you access our website, we
          automatically log information about you and your device. This includes
          your device&apos;s operating system, manufacturer and model, browser
          type, language, screen resolution, the website you visited prior to
          ours, pages viewed, time spent on each page, access times, and your
          actions on our website. We collect this information using cookies.
        </div>
        <div>
          Automated Decision Making and Profiling: We do not use your personal
          data for automated decision-making purposes, except when required by
          law. If such processing is necessary, we will notify you and provide
          an opportunity to object.
        </div>
        <div>
          User Profiles and Submissions: Certain user profile information,
          including your name, location, and any uploaded videos or images, may
          be visible to other users to facilitate interaction within the
          services or address your service requests. You can adjust your account
          privacy settings to limit the visibility of personal information in
          your profile. Please be aware that content you upload to your public
          user profile, along with any personal information or content disclosed
          publicly (e.g., discussion boards, messages, chat areas), becomes
          publicly available and can be collected and used by anyone. Your
          username may also be displayed to other users when you send messages,
          comments, or upload content. If you sign in through a third-party
          social networking site, your list of friends from that site may be
          imported to our services, and your friends who are also registered
          users may access certain non-public information from your profile. We
          do not control the policies and practices of third-party sites or
          services.
        </div>
      </div>
    );
  };

  const renderCookies = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          Cookies
        </div>
        <div className="text-lg font-semibold">What are cookies?</div>
        <div>
          We may collect information using &quot;cookies,&quot; which are small
          data files stored on your computer or mobile device by a website. We
          use both session cookies (which expire when you close your browser)
          and persistent cookies (which remain on your computer or device until
          deleted) to provide a personalized and interactive experience on our
          website.
        </div>
        <div className="text-lg font-semibold">How do we use cookies?</div>
        <div>We use cookies for various purposes, including:</div>
        <div>
          Authentication and Security: Cookies help authenticate your access to
          our website and prevent unauthorized usage. They also aid in
          implementing security features and detecting any fraudulent activity.
        </div>
        <div>
          Preferences: Cookies allow us to remember your preferences, such as
          language settings and display options, to enhance your browsing
          experience and personalize the content you see.
        </div>
        <div>
          Analytics: We use cookies to gather information about how visitors
          interact with our website, such as which pages are visited most
          frequently, how long users spend on each page, and which links they
          click. This data helps us analyze and improve the performance and
          usability of our website.
        </div>
        <div>
          Advertising: Cookies enable us to deliver targeted advertisements
          based on your interests and browsing behavior. They help us track the
          effectiveness of our advertising campaigns and limit the number of
          times you see a particular ad.
        </div>
        <div>
          Social Media Integration: Our website may include social media
          features or links that allow you to share content on social networking
          platforms. These features may use cookies to track your interaction
          with the respective platform or to customize the content displayed to
          you.
        </div>
      </div>
    );
  };

  const renderManagingCookies = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          Managing Cookies
        </div>
        <div>
          You have the option to accept or decline cookies. Most web browsers
          automatically accept cookies, but you can modify your browser settings
          to decline cookies if you prefer. However, please note that disabling
          cookies may limit your ability to fully experience the features and
          functionality of our website.
        </div>
        <div>
          To manage cookies, you can typically adjust your browser settings. The
          &quot;Help&quot; section of your browser should provide instructions
          on how to block, delete, or disable cookies. You can also visit
          www.allaboutcookies.org for more information on managing cookies in
          different browsers.
        </div>
        <div>
          Please note that if you choose to disable cookies, some features of
          our website may not function properly, and your preferences may not be
          saved.
        </div>
      </div>
    );
  };

  const renderSecurityMeasures = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          Security Measures
        </div>
        <div>
          We have implemented appropriate security measures to protect your
          personal data against unauthorized access, alteration, disclosure, or
          destruction. These measures include encryption, firewalls, access
          controls, and regular security assessments. However, please be aware
          that no method of transmission over the internet or electronic storage
          is 100% secure, and we cannot guarantee absolute security.
        </div>
      </div>
    );
  };

  const renderDataRetention = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          Data Retention
        </div>
        <div>
          We retain your personal data for as long as necessary to fulfill the
          purposes outlined in this Policy, unless a longer retention period is
          required or permitted by law. The criteria used to determine the
          appropriate retention period include the nature of the data, the
          purposes for which it is processed, and any legal or regulatory
          obligations.
        </div>
      </div>
    );
  };

  const renderOurPolicyOnChildren = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          Our Policy on Children
        </div>
        <div>
          Our website is not directed to children under 18. If a parent or
          guardian becomes aware that his or her child has provided us with
          information without their consent, he or she should contact us. We
          will delete such information from our files as soon as reasonably
          practicable.
        </div>
      </div>
    );
  };

  const renderYourRights = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          Your Rights
        </div>
        <div>
          You have certain rights regarding your personal data, subject to
          applicable laws and regulations. These rights may include:
        </div>
        <div>
          <strong>Right to Access:</strong> You can request access to the
          personal data we hold about you and receive a copy of it.
        </div>
        <div>
          <strong>Right to Rectification:</strong> You can request to correct
          inaccurate or incomplete personal data we have about you.
        </div>
        <div>
          <strong>Right to Erasure:</strong> You can request the deletion of
          your personal data under certain circumstances, such as when it is no
          longer necessary for the purposes for which it was collected.
        </div>
        <div>
          <strong>Right to Restrict Processing:</strong> You can request to
          restrict the processing of your personal data under certain
          circumstances, such as when the accuracy of the data is contested or
          the processing is unlawful.
        </div>
        <div>
          <strong>Right to Data Portability:</strong> You can request a copy of
          your personal data in a commonly used and machine-readable format, or
          you can ask us to transmit it to another controller if technically
          feasible.
        </div>
        <div>
          <strong>Right to Object:</strong> You can object to the processing of
          your personal data under certain circumstances, such as for direct
          marketing purposes or when the processing is based on legitimate
          interests.
        </div>
        <div>
          <strong>Right to Withdraw Consent:</strong> If we rely on your consent
          to process your personal data, you have the right to withdraw that
          consent at any time.
        </div>
        <div>
          To exercise your rights or if you have any privacy-related questions
          or concerns, please contact us using the contact details provided in
          our website.
        </div>
      </div>
    );
  };

  const renderFinal = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div>
          We hope this provides you with a comprehensive overview of cookies and
          their use on our website. If you have any further questions, feel free
          to ask!
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col justify-center gap-8 p-4 xl:w-3/4 xl:self-center 2xl:w-3/4 3xl:w-3/4 4xl:w-2/4 5xl:w-2/4">
      <div className="text-center font-playfair text-4xl font-semibold">
        Privacy Policy
      </div>
      <div className="text-center font-playfair text-4xl font-semibold">
        Last Updated: June 10th, 2023
      </div>
      {renderIntroduction()}
      {renderPurposesOfProcessing()}
      {renderCollectionYourPersonalData()}
      {renderCookies()}
      {renderManagingCookies()}
      {renderSecurityMeasures()}
      {renderDataRetention()}
      {renderOurPolicyOnChildren()}
      {renderYourRights()}
      {renderFinal()}
    </div>
  );
};

export { PrivacyPolicyPage };
