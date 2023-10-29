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

type EmailActions =
  | {
      action: "buyerAddDetailsEmail";
      buyerName: string;
      fromUs: string;
      toInfluencerEmail: string;
      influencerLanguage: string;
      orderId: number;
    }
  | {
      action: "buyerConfirmedEmail";
      buyerName: string;
      fromUs: string;
      toInfluencerEmail: string;
      influencerLanguage: string;
      orderId: number;
    }
  | {
      action: "buyerOpensDisputeToInfluencerEmail";
      buyerName: string;
      fromUs: string;
      toInfluencerEmail: string;
      influencerLanguage: string;
      orderId: number;
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
    }
  | {
      action: "buyerReviewedOrderEmail";
      buyerName: string;
      fromUs: string;
      toInfluencerEmail: string;
      influencerLanguage: string;
      orderId: number;
    }
  | {
      action: "contactUsEmail";
      influencerMarktEmail: string;
      email: string;
      message: string;
      messagedId: string;
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
    }
  | {
      action: "influencerDeliveredOrderEmail";
      influencerName: string;
      fromUs: string;
      toBuyer: string;
      buyerLanguage: string;
      orderId: number;
    }
  | {
      action: "influencerMarktConfirmEmail";
      fromUs: string;
      to: string;
      language: string;
      orderId: number;
    }
  | {
      action: "influencerOrderWasRectified";
      fromUs: string;
      toInfluencer: string;
      influencerLanguage: string;
      orderId: number;
    }
  | {
      action: "newMessageOrderEmail";
    }
  | {
      action: "newOrderEmail";
      buyerName: string;
      fromUs: string;
      toInfluencer: string;
      influencerLanguage: string;
      orderId: number;
    }
  | {
      action: "toBuyerDeliveryIsTomorrowEmail";
      influencerName: string;
      fromUs: string;
      toBuyer: string;
      buyerLanguage: string;
      orderId: number;
    }
  | {
      action: "toBuyerInfluencerIsRightEmail";
      influencerName: string;
      fromUs: string;
      toBuyer: string;
      buyerLanguage: string;
      orderId: number;
    }
  | {
      action: "toBuyerInfluencerIsWrongEmail";
      influencerName: string;
      fromUs: string;
      toBuyer: string;
      buyerLanguage: string;
      orderId: number;
    }
  | {
      action: "toBuyerOrderOnHoldEmail";
      influencerName: string;
      fromUs: string;
      toBuyer: string;
      buyerLanguage: string;
      orderId: number;
    }
  | {
      action: "toInfluencerDeliveryIsTomorrowEmail";
      buyerName: string;
      fromUs: string;
      toInfluencerEmail: string;
      influencerLanguage: string;
      orderId: number;
    }
  | {
      action: "toInfluencerInfluencerIsRightEmail";
      buyerName: string;
      fromUs: string;
      toInfluencerEmail: string;
      influencerLanguage: string;
      orderId: number;
    }
  | {
      action: "toInfluencerInfluencerIsWrongEmail";
      buyerName: string;
      fromUs: string;
      toInfluencerEmail: string;
      influencerLanguage: string;
      orderId: number;
    }
  | {
      action: "toInfluencerOnHoldtoPostponed";
      buyerName: string;
      fromUs: string;
      toInfluencerEmail: string;
      influencerLanguage: string;
      orderId: number;
    }
  | {
      action: "toInfluencerOrderOnHoldEmail";
      buyerName: string;
      fromUs: string;
      toInfluencerEmail: string;
      influencerLanguage: string;
      orderId: number;
    }
  | {
      action: "toInfluencerOrderOnHoldToRefund";
      buyerName: string;
      fromUs: string;
      toInfluencerEmail: string;
      influencerLanguage: string;
      orderId: number;
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

export const sendEmail = (params: { emailAction: EmailActions }) => {
  if (params.emailAction.action === "buyerAddDetailsEmail") {
    buyerAddDetailsEmail({
      buyerName: params.emailAction.buyerName,
      from: params.emailAction.fromUs,
      to: params.emailAction.toInfluencerEmail,
      language: params.emailAction.influencerLanguage,
      orderId: params.emailAction.orderId,
    });
  } else if (params.emailAction.action === "buyerConfirmedEmail") {
    buyerConfirmedEmail({
      buyerName: params.emailAction.buyerName,
      from: params.emailAction.fromUs,
      to: params.emailAction.toInfluencerEmail,
      language: params.emailAction.influencerLanguage,
      orderId: params.emailAction.orderId,
    });
  } else if (
    params.emailAction.action === "buyerOpensDisputeToInfluencerEmail"
  ) {
    buyerOpensDisputeToInfluencerEmail({
      buyerName: params.emailAction.buyerName,
      from: params.emailAction.fromUs,
      to: params.emailAction.toInfluencerEmail,
      language: params.emailAction.influencerLanguage,
      orderId: params.emailAction.orderId,
    });
  } else if (
    params.emailAction.action === "buyerOpenedDisputeToOurInboxEmail"
  ) {
    buyerOpenedDisputeToOurInboxEmail({
      buyerName: params.emailAction.buyerName,
      buyerEmail: params.emailAction.buyerEmail,
      from: params.emailAction.influencerMarktEmail,
      to: params.emailAction.influencerMarktEmail,
      issueMessage: params.emailAction.issueMessage,
      orderId: params.emailAction.orderId.toString(),
    });
  } else if (params.emailAction.action === "buyerOrderWasRectified") {
    buyerOrderWasRectified({
      influencerName: params.emailAction.influencerName,
      from: params.emailAction.fromUs,
      to: params.emailAction.toBuyer,
      language: params.emailAction.buyerLanguage,
      orderId: params.emailAction.orderId,
    });
  } else if (params.emailAction.action === "buyerReviewedOrderEmail") {
    buyerReviewedOrderEmail({
      buyerName: params.emailAction.buyerName,
      from: params.emailAction.fromUs,
      to: params.emailAction.toInfluencerEmail,
      language: params.emailAction.influencerLanguage,
      orderId: params.emailAction.orderId,
    });
  } else if (params.emailAction.action === "contactUsEmail") {
    contactUsEmail({
      from: params.emailAction.influencerMarktEmail,
      to: params.emailAction.influencerMarktEmail,
      email: params.emailAction.email,
      message: params.emailAction.message,
      messageId: params.emailAction.messagedId,
      name: params.emailAction.name,
      reason: params.emailAction.reasonText,
    });
  } else if (params.emailAction.action === "influencerAcceptedOrderEmail") {
    influencerAcceptedOrderEmail({
      influencerName: params.emailAction.influencerName,
      from: params.emailAction.fromUs,
      to: params.emailAction.toBuyer,
      language: params.emailAction.buyerLanguage,
      orderId: params.emailAction.orderId,
    });
  } else if (params.emailAction.action === "influencerDeliveredOrderEmail") {
    influencerDeliveredOrderEmail({
      influencerName: params.emailAction.influencerName,
      from: params.emailAction.fromUs,
      to: params.emailAction.toBuyer,
      language: params.emailAction.buyerLanguage,
      orderId: params.emailAction.orderId,
    });
  } else if (params.emailAction.action === "influencerMarktConfirmEmail") {
    influencerMarktConfirmEmail({
      from: params.emailAction.fromUs,
      to: params.emailAction.to,
      language: params.emailAction.language,
      orderId: params.emailAction.orderId,
    });
  } else if (params.emailAction.action === "influencerOrderWasRectified") {
    influencerOrderWasRectified({
      from: params.emailAction.fromUs,
      to: params.emailAction.toInfluencer,
      language: params.emailAction.influencerLanguage,
      orderId: params.emailAction.orderId,
    });
  } else if (params.emailAction.action === "newMessageOrderEmail") {
  } else if (params.emailAction.action === "newOrderEmail") {
    newOrderEmail({
      buyer: params.emailAction.buyerName,
      from: params.emailAction.fromUs,
      to: params.emailAction.toInfluencer,
      language: params.emailAction.influencerLanguage,
      orderId: params.emailAction.orderId,
    });
  } else if (params.emailAction.action === "toBuyerDeliveryIsTomorrowEmail") {
    toBuyerDeliveryIsTomorrowEmail({
      influencerName: params.emailAction.influencerName,
      from: params.emailAction.fromUs,
      to: params.emailAction.toBuyer,
      language: params.emailAction.buyerLanguage,
      orderId: params.emailAction.orderId,
    });
  } else if (params.emailAction.action === "toBuyerInfluencerIsRightEmail") {
    toBuyerInfluencerIsRightEmail({
      influencerName: params.emailAction.influencerName,
      from: params.emailAction.fromUs,
      to: params.emailAction.toBuyer,
      language: params.emailAction.buyerLanguage,
      orderId: params.emailAction.orderId,
    });
  } else if (params.emailAction.action === "toBuyerInfluencerIsWrongEmail") {
    toBuyerInfluencerIsWrongEmail({
      influencerName: params.emailAction.influencerName,
      from: params.emailAction.fromUs,
      to: params.emailAction.toBuyer,
      language: params.emailAction.buyerLanguage,
      orderId: params.emailAction.orderId,
    });
  } else if (params.emailAction.action === "toBuyerOrderOnHoldEmail") {
    toBuyerOrderOnHoldEmail({
      influencerName: params.emailAction.influencerName,
      from: params.emailAction.fromUs,
      to: params.emailAction.toBuyer,
      language: params.emailAction.buyerLanguage,
      orderId: params.emailAction.orderId,
    });
  } else if (
    params.emailAction.action === "toInfluencerDeliveryIsTomorrowEmail"
  ) {
    toInfluencerDeliveryIsTomorrowEmail({
      buyerName: params.emailAction.buyerName,
      from: params.emailAction.fromUs,
      to: params.emailAction.toInfluencerEmail,
      language: params.emailAction.influencerLanguage,
      orderId: params.emailAction.orderId,
    });
  } else if (
    params.emailAction.action === "toInfluencerInfluencerIsRightEmail"
  ) {
    toInfluencerInfluencerIsRightEmail({
      buyerName: params.emailAction.buyerName,
      from: params.emailAction.fromUs,
      to: params.emailAction.toInfluencerEmail,
      language: params.emailAction.influencerLanguage,
      orderId: params.emailAction.orderId,
    });
  } else if (
    params.emailAction.action === "toInfluencerInfluencerIsWrongEmail"
  ) {
    toInfluencerInfluencerIsWrongEmail({
      buyerName: params.emailAction.buyerName,
      from: params.emailAction.fromUs,
      to: params.emailAction.toInfluencerEmail,
      language: params.emailAction.influencerLanguage,
      orderId: params.emailAction.orderId,
    });
  } else if (params.emailAction.action === "toInfluencerOnHoldtoPostponed") {
    toInfluencerOnHoldtoPostponed({
      buyerName: params.emailAction.buyerName,
      from: params.emailAction.fromUs,
      to: params.emailAction.toInfluencerEmail,
      language: params.emailAction.influencerLanguage,
      orderId: params.emailAction.orderId,
    });
  } else if (params.emailAction.action === "toInfluencerOrderOnHoldEmail") {
    toInfluencerOrderOnHoldEmail({
      buyerName: params.emailAction.buyerName,
      from: params.emailAction.fromUs,
      to: params.emailAction.toInfluencerEmail,
      language: params.emailAction.influencerLanguage,
      orderId: params.emailAction.orderId,
    });
  } else if (params.emailAction.action === "toInfluencerOrderOnHoldToRefund") {
    toInfluencerOrderOnHoldToRefund({
      buyerName: params.emailAction.buyerName,
      from: params.emailAction.fromUs,
      to: params.emailAction.toInfluencerEmail,
      language: params.emailAction.influencerLanguage,
      orderId: params.emailAction.orderId,
    });
  } else if (params.emailAction.action === "weReceivedContactEmail") {
    weReceivedContactEmail({
      from: params.emailAction.fromUs,
      to: params.emailAction.email,
      email: params.emailAction.email,
      message: params.emailAction.message,
      name: params.emailAction.name,
      reason: params.emailAction.reasonText,
      language: params.emailAction.language,
    });
  }
};
