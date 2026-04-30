const generateAnalyticsInsights = (analyticsData) => {
  const insights = [];

  if (!analyticsData?.coAttainment?.length) {
    return [
      "No submissions yet for this course.",
      "Insights will appear after students submit feedback.",
    ];
  }

  const weakCOs = analyticsData.coAttainment.filter((co) => co.percentage < 40);
  const mediumCOs = analyticsData.coAttainment.filter(
    (co) => co.percentage >= 40 && co.percentage < 70
  );
  const strongCOs = analyticsData.coAttainment.filter(
    (co) => co.percentage >= 70
  );

  if (strongCOs.length) {
    insights.push(
      `${strongCOs.length} CO${strongCOs.length > 1 ? "s are" : " is"} performing strongly with good student feedback`
    );
  }

  if (mediumCOs.length) {
    insights.push(
      `${mediumCOs.length} CO${mediumCOs.length > 1 ? "s" : ""} show moderate attainment and may need teaching reinforcement`
    );
  }

  if (weakCOs.length) {
    insights.push(
      `${weakCOs.length} CO${weakCOs.length > 1 ? "s are" : " is"} weak and need immediate academic intervention`
    );
  }

  weakCOs.forEach((co) => {
    insights.push(
      `${co.coCode} is low at ${co.percentage}%. Consider revising the teaching strategy for this outcome.`
    );
  });

  if (analyticsData.averageScore >= 4) {
    insights.push("Overall student sentiment is highly positive.");
  } else if (analyticsData.averageScore >= 3) {
    insights.push("Overall student feedback is average.");
  } else {
    insights.push(
      "Overall student feedback is below expectation and needs improvement."
    );
  }

  return insights;
};

export default generateAnalyticsInsights;
