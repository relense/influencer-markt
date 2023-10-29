import { buyerAddDetailsEmail } from "../emailTemplates/buyerAddDetailsEmail/buyerAddDetailsEmail";
import { buyerConfirmedEmail } from "../emailTemplates/buyerConfirmOrderEmail/buyerConfirmOrderEmail";
import { buyerOpensDisputeToInfluencerEmail } from "../emailTemplates/buyerOpensDisputeToInfluencerEmail/buyerOpensDisputeToInfluencerEmail";
import { buyerOpenedDisputeToOurInboxEmail } from "../emailTemplates/buyerOpensDisputeToOurInboxEmail/buyerOpensDisputeToOurInboxEmail";
import { buyerOrderWasRectified } from "../emailTemplates/buyerOrderWasRectified/buyerOrderWasRectified";
import { buyerReviewedOrderEmail } from "../emailTemplates/buyerReviewedOrderEmail/buyerReviewedOrderEmail";
import { contactUsEmail } from "../emailTemplates/contactUsEmail/contactUsEmail";
import { influencerAcceptedOrderEmail } from "../emailTemplates/influencerAcceptedOrderEmail/influencerAcceptedOrderEmail";
import { influencerDeliveredOrderEmail } from "../emailTemplates/influencerDeliveredEmail/influencerDeliveredEmail";
import { influencerMarktConfirmEmail } from "../emailTemplates/influencerMarktConfirmEmail/influencerMarktConfirmEmail";
import { influencerOrderWasRectified } from "../emailTemplates/influencerOrderWasRectified/influencerOrderWasRectified";
import { newOrderEmail } from "../emailTemplates/newOrderEmail/newOrderEmail";
import { toBuyerDeliveryIsTomorrowEmail } from "../emailTemplates/toBuyerDeliveryIsTomorrowEmail/toBuyerDeliveryIsTomorrowEmail";
import { toBuyerInfluencerIsRightEmail } from "../emailTemplates/toBuyerInfluencerIsRightEmail/toBuyerInfluencerIsRightEmail";
import { toBuyerInfluencerIsWrongEmail } from "../emailTemplates/toBuyerInfluencerIsWrongEmail/toBuyerInfluencerIsWrongEmail";
import { toBuyerOrderOnHoldEmail } from "../emailTemplates/toBuyerOrderOnHoldEmail/toBuyerOrderOnHoldEmail";
import { toInfluencerDeliveryIsTomorrowEmail } from "../emailTemplates/toInfluencerDeliveryIsTomorrowEmail/toInfluencerDeliveryIsTomorrowEmail";
import { toInfluencerInfluencerIsRightEmail } from "../emailTemplates/toInfluencerInfluencerIsRightEmail/toInfluencerInfluencerIsRightEmail";
import { toInfluencerInfluencerIsWrongEmail } from "../emailTemplates/toInfluencerInfluencerIsWrongEmail/toInfluencerInfluencerIsWrongEmail";
import { toInfluencerOnHoldtoPostponed } from "../emailTemplates/toInfluencerOnHoldtoPostponed/toInfluencerOnHoldtoPostponed";
import { toInfluencerOrderOnHoldEmail } from "../emailTemplates/toInfluencerOrderOnHoldEmail/toInfluencerOrderOnHoldEmail";
import { toInfluencerOrderOnHoldToRefund } from "../emailTemplates/toInfluencerOrderOnHoldToRefund/toInfluencerOrderOnHoldToRefund";
import { weReceivedContactEmail } from "../emailTemplates/weReceivedContactEmail/weReceivedContactEmail";
import { prisma } from "../server/db";

type EmailActions =
  | {
      action: "buyerAddDetailsEmail";
      buyerName: string;
      fromUs: string;
      toInfluencerEmail: string;
      influencerLanguage: string;
      orderId: number;
      receiverProfileId: number;
    }
  | {
      action: "buyerConfirmedEmail";
      buyerName: string;
      fromUs: string;
      toInfluencerEmail: string;
      influencerLanguage: string;
      orderId: number;
      receiverProfileId: number;
    }
  | {
      action: "buyerOpensDisputeToInfluencerEmail";
      buyerName: string;
      fromUs: string;
      toInfluencerEmail: string;
      influencerLanguage: string;
      orderId: number;
      receiverProfileId: number;
    }
  | {
      action: "buyerOpenedDisputeToOurInboxEmail";
      buyerName: string;
      buyerEmail: string;
      influencerMarktEmail: string;
      issueMessage: string;
      orderId: number;
    }
  | {
      action: "buyerOrderWasRectified";
      influencerName: string;
      fromUs: string;
      toBuyer: string;
      buyerLanguage: string;
      orderId: number;
      receiverProfileId: number;
    }
  | {
      action: "buyerReviewedOrderEmail";
      buyerName: string;
      fromUs: string;
      toInfluencerEmail: string;
      influencerLanguage: string;
      orderId: number;
      receiverProfileId: number;
    }
  | {
      action: "contactUsEmail";
      influencerMarktEmail: string;
      email: string;
      message: string;
      messageId: string;
      name: string;
      reasonText: string;
    }
  | {
      action: "influencerAcceptedOrderEmail";
      influencerName: string;
      fromUs: string;
      toBuyer: string;
      buyerLanguage: string;
      orderId: number;
      receiverProfileId: number;
    }
  | {
      action: "influencerDeliveredOrderEmail";
      influencerName: string;
      fromUs: string;
      toBuyer: string;
      buyerLanguage: string;
      orderId: number;
      receiverProfileId: number;
    }
  | {
      action: "influencerMarktConfirmEmail";
      fromUs: string;
      to: string;
      language: string;
      orderId: number;
      receiverProfileId: number;
    }
  | {
      action: "influencerOrderWasRectified";
      fromUs: string;
      toInfluencer: string;
      influencerLanguage: string;
      orderId: number;
      receiverProfileId: number;
    }
  | {
      action: "newMessageOrderEmail";
      receiverProfileId: number;
    }
  | {
      action: "newOrderEmail";
      buyerName: string;
      fromUs: string;
      toInfluencer: string;
      influencerLanguage: string;
      orderId: number;
      receiverProfileId: number;
    }
  | {
      action: "toBuyerDeliveryIsTomorrowEmail";
      influencerName: string;
      fromUs: string;
      toBuyer: string;
      buyerLanguage: string;
      orderId: number;
      receiverProfileId: number;
    }
  | {
      action: "toBuyerInfluencerIsRightEmail";
      influencerName: string;
      fromUs: string;
      toBuyer: string;
      buyerLanguage: string;
      orderId: number;
      receiverProfileId: number;
    }
  | {
      action: "toBuyerInfluencerIsWrongEmail";
      influencerName: string;
      fromUs: string;
      toBuyer: string;
      buyerLanguage: string;
      orderId: number;
      receiverProfileId: number;
    }
  | {
      action: "toBuyerOrderOnHoldEmail";
      influencerName: string;
      fromUs: string;
      toBuyer: string;
      buyerLanguage: string;
      orderId: number;
      receiverProfileId: number;
    }
  | {
      action: "toInfluencerDeliveryIsTomorrowEmail";
      buyerName: string;
      fromUs: string;
      toInfluencerEmail: string;
      influencerLanguage: string;
      orderId: number;
      receiverProfileId: number;
    }
  | {
      action: "toInfluencerInfluencerIsRightEmail";
      buyerName: string;
      fromUs: string;
      toInfluencerEmail: string;
      influencerLanguage: string;
      orderId: number;
      receiverProfileId: number;
    }
  | {
      action: "toInfluencerInfluencerIsWrongEmail";
      buyerName: string;
      fromUs: string;
      toInfluencerEmail: string;
      influencerLanguage: string;
      orderId: number;
      receiverProfileId: number;
    }
  | {
      action: "toInfluencerOnHoldtoPostponed";
      buyerName: string;
      fromUs: string;
      toInfluencerEmail: string;
      influencerLanguage: string;
      orderId: number;
      receiverProfileId: number;
    }
  | {
      action: "toInfluencerOrderOnHoldEmail";
      buyerName: string;
      fromUs: string;
      toInfluencerEmail: string;
      influencerLanguage: string;
      orderId: number;
      receiverProfileId: number;
    }
  | {
      action: "toInfluencerOrderOnHoldToRefund";
      buyerName: string;
      fromUs: string;
      toInfluencerEmail: string;
      influencerLanguage: string;
      orderId: number;
      receiverProfileId: number;
    }
  | {
      action: "weReceivedContactEmail";
      fromUs: string;
      to: string;
      email: string;
      message: string;
      name: string;
      reasonText: string;
      language: string;
    };

const checkIfIsDisabled = async (profileId: number) => {
  if (profileId === -1) return true;

  const user = await prisma.user.findFirst({
    where: {
      profile: {
        id: profileId,
      },
    },
    select: {
      disableEmailNotifications: true,
    },
  });

  return user?.disableEmailNotifications;
};

export const sendEmail = async (emailAction: EmailActions) => {
  if (emailAction.action === "buyerAddDetailsEmail") {
    const isDisabled = await checkIfIsDisabled(emailAction.receiverProfileId);

    if (isDisabled) return;
    buyerAddDetailsEmail({
      buyerName: emailAction.buyerName,
      from: emailAction.fromUs,
      to: emailAction.toInfluencerEmail,
      language: emailAction.influencerLanguage,
      orderId: emailAction.orderId,
    });
  } else if (emailAction.action === "buyerConfirmedEmail") {
    const isDisabled = await checkIfIsDisabled(emailAction.receiverProfileId);

    if (isDisabled) return;
    buyerConfirmedEmail({
      buyerName: emailAction.buyerName,
      from: emailAction.fromUs,
      to: emailAction.toInfluencerEmail,
      language: emailAction.influencerLanguage,
      orderId: emailAction.orderId,
    });
  } else if (emailAction.action === "buyerOpensDisputeToInfluencerEmail") {
    const isDisabled = await checkIfIsDisabled(emailAction.receiverProfileId);

    if (isDisabled) return;
    buyerOpensDisputeToInfluencerEmail({
      buyerName: emailAction.buyerName,
      from: emailAction.fromUs,
      to: emailAction.toInfluencerEmail,
      language: emailAction.influencerLanguage,
      orderId: emailAction.orderId,
    });
  } else if (emailAction.action === "buyerOpenedDisputeToOurInboxEmail") {
    buyerOpenedDisputeToOurInboxEmail({
      buyerName: emailAction.buyerName,
      buyerEmail: emailAction.buyerEmail,
      from: emailAction.influencerMarktEmail,
      to: emailAction.influencerMarktEmail,
      issueMessage: emailAction.issueMessage,
      orderId: emailAction.orderId.toString(),
    });
  } else if (emailAction.action === "buyerOrderWasRectified") {
    const isDisabled = await checkIfIsDisabled(emailAction.receiverProfileId);

    if (isDisabled) return;
    buyerOrderWasRectified({
      influencerName: emailAction.influencerName,
      from: emailAction.fromUs,
      to: emailAction.toBuyer,
      language: emailAction.buyerLanguage,
      orderId: emailAction.orderId,
    });
  } else if (emailAction.action === "buyerReviewedOrderEmail") {
    const isDisabled = await checkIfIsDisabled(emailAction.receiverProfileId);

    if (isDisabled) return;
    buyerReviewedOrderEmail({
      buyerName: emailAction.buyerName,
      from: emailAction.fromUs,
      to: emailAction.toInfluencerEmail,
      language: emailAction.influencerLanguage,
      orderId: emailAction.orderId,
    });
  } else if (emailAction.action === "contactUsEmail") {
    contactUsEmail({
      from: emailAction.influencerMarktEmail,
      to: emailAction.influencerMarktEmail,
      email: emailAction.email,
      message: emailAction.message,
      messageId: emailAction.messageId,
      name: emailAction.name,
      reason: emailAction.reasonText,
    });
  } else if (emailAction.action === "influencerAcceptedOrderEmail") {
    const isDisabled = await checkIfIsDisabled(emailAction.receiverProfileId);

    if (isDisabled) return;
    influencerAcceptedOrderEmail({
      influencerName: emailAction.influencerName,
      from: emailAction.fromUs,
      to: emailAction.toBuyer,
      language: emailAction.buyerLanguage,
      orderId: emailAction.orderId,
    });
  } else if (emailAction.action === "influencerDeliveredOrderEmail") {
    const isDisabled = await checkIfIsDisabled(emailAction.receiverProfileId);

    if (isDisabled) return;
    influencerDeliveredOrderEmail({
      influencerName: emailAction.influencerName,
      from: emailAction.fromUs,
      to: emailAction.toBuyer,
      language: emailAction.buyerLanguage,
      orderId: emailAction.orderId,
    });
  } else if (emailAction.action === "influencerMarktConfirmEmail") {
    const isDisabled = await checkIfIsDisabled(emailAction.receiverProfileId);

    if (isDisabled) return;
    influencerMarktConfirmEmail({
      from: emailAction.fromUs,
      to: emailAction.to,
      language: emailAction.language,
      orderId: emailAction.orderId,
    });
  } else if (emailAction.action === "influencerOrderWasRectified") {
    const isDisabled = await checkIfIsDisabled(emailAction.receiverProfileId);

    if (isDisabled) return;
    influencerOrderWasRectified({
      from: emailAction.fromUs,
      to: emailAction.toInfluencer,
      language: emailAction.influencerLanguage,
      orderId: emailAction.orderId,
    });
  } else if (emailAction.action === "newMessageOrderEmail") {
    const isDisabled = await checkIfIsDisabled(emailAction.receiverProfileId);

    if (isDisabled) return;
  } else if (emailAction.action === "newOrderEmail") {
    const isDisabled = await checkIfIsDisabled(emailAction.receiverProfileId);

    if (isDisabled) return;
    newOrderEmail({
      buyer: emailAction.buyerName,
      from: emailAction.fromUs,
      to: emailAction.toInfluencer,
      language: emailAction.influencerLanguage,
      orderId: emailAction.orderId,
    });
  } else if (emailAction.action === "toBuyerDeliveryIsTomorrowEmail") {
    const isDisabled = await checkIfIsDisabled(emailAction.receiverProfileId);

    if (isDisabled) return;
    toBuyerDeliveryIsTomorrowEmail({
      influencerName: emailAction.influencerName,
      from: emailAction.fromUs,
      to: emailAction.toBuyer,
      language: emailAction.buyerLanguage,
      orderId: emailAction.orderId,
    });
  } else if (emailAction.action === "toBuyerInfluencerIsRightEmail") {
    const isDisabled = await checkIfIsDisabled(emailAction.receiverProfileId);

    if (isDisabled) return;
    toBuyerInfluencerIsRightEmail({
      influencerName: emailAction.influencerName,
      from: emailAction.fromUs,
      to: emailAction.toBuyer,
      language: emailAction.buyerLanguage,
      orderId: emailAction.orderId,
    });
  } else if (emailAction.action === "toBuyerInfluencerIsWrongEmail") {
    const isDisabled = await checkIfIsDisabled(emailAction.receiverProfileId);

    if (isDisabled) return;
    toBuyerInfluencerIsWrongEmail({
      influencerName: emailAction.influencerName,
      from: emailAction.fromUs,
      to: emailAction.toBuyer,
      language: emailAction.buyerLanguage,
      orderId: emailAction.orderId,
    });
  } else if (emailAction.action === "toBuyerOrderOnHoldEmail") {
    const isDisabled = await checkIfIsDisabled(emailAction.receiverProfileId);

    if (isDisabled) return;
    toBuyerOrderOnHoldEmail({
      influencerName: emailAction.influencerName,
      from: emailAction.fromUs,
      to: emailAction.toBuyer,
      language: emailAction.buyerLanguage,
      orderId: emailAction.orderId,
    });
  } else if (emailAction.action === "toInfluencerDeliveryIsTomorrowEmail") {
    const isDisabled = await checkIfIsDisabled(emailAction.receiverProfileId);

    if (isDisabled) return;
    toInfluencerDeliveryIsTomorrowEmail({
      buyerName: emailAction.buyerName,
      from: emailAction.fromUs,
      to: emailAction.toInfluencerEmail,
      language: emailAction.influencerLanguage,
      orderId: emailAction.orderId,
    });
  } else if (emailAction.action === "toInfluencerInfluencerIsRightEmail") {
    const isDisabled = await checkIfIsDisabled(emailAction.receiverProfileId);

    if (isDisabled) return;
    toInfluencerInfluencerIsRightEmail({
      buyerName: emailAction.buyerName,
      from: emailAction.fromUs,
      to: emailAction.toInfluencerEmail,
      language: emailAction.influencerLanguage,
      orderId: emailAction.orderId,
    });
  } else if (emailAction.action === "toInfluencerInfluencerIsWrongEmail") {
    const isDisabled = await checkIfIsDisabled(emailAction.receiverProfileId);

    if (isDisabled) return;
    toInfluencerInfluencerIsWrongEmail({
      buyerName: emailAction.buyerName,
      from: emailAction.fromUs,
      to: emailAction.toInfluencerEmail,
      language: emailAction.influencerLanguage,
      orderId: emailAction.orderId,
    });
  } else if (emailAction.action === "toInfluencerOnHoldtoPostponed") {
    const isDisabled = await checkIfIsDisabled(emailAction.receiverProfileId);

    if (isDisabled) return;
    toInfluencerOnHoldtoPostponed({
      buyerName: emailAction.buyerName,
      from: emailAction.fromUs,
      to: emailAction.toInfluencerEmail,
      language: emailAction.influencerLanguage,
      orderId: emailAction.orderId,
    });
  } else if (emailAction.action === "toInfluencerOrderOnHoldEmail") {
    const isDisabled = await checkIfIsDisabled(emailAction.receiverProfileId);

    if (isDisabled) return;
    toInfluencerOrderOnHoldEmail({
      buyerName: emailAction.buyerName,
      from: emailAction.fromUs,
      to: emailAction.toInfluencerEmail,
      language: emailAction.influencerLanguage,
      orderId: emailAction.orderId,
    });
  } else if (emailAction.action === "toInfluencerOrderOnHoldToRefund") {
    const isDisabled = await checkIfIsDisabled(emailAction.receiverProfileId);

    if (isDisabled) return;
    toInfluencerOrderOnHoldToRefund({
      buyerName: emailAction.buyerName,
      from: emailAction.fromUs,
      to: emailAction.toInfluencerEmail,
      language: emailAction.influencerLanguage,
      orderId: emailAction.orderId,
    });
  } else if (emailAction.action === "weReceivedContactEmail") {
    weReceivedContactEmail({
      from: emailAction.fromUs,
      to: emailAction.email,
      email: emailAction.email,
      message: emailAction.message,
      name: emailAction.name,
      reason: emailAction.reasonText,
      language: emailAction.language,
    });
  }
};
