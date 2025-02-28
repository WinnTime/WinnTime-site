let subscriptions = [];

export const addSubscription = (subscription) => {
  subscriptions.push(subscription);
};

export const getSubscriptions = () => subscriptions;
