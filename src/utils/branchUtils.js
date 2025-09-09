// utils/branchUtils.js
import branch, { BranchEvent } from 'react-native-branch';

export const generateBranchLink = async ({ id, type, title, description }) => {
  const buo = await branch.createBranchUniversalObject(`reactnative/branch`, {
    title: title || 'Expense Jar Reference Link',
    contentDescription: description || 'This is an Expense Jar reference link',
    contentMetadata: {
      customMetadata: {
        id: id.toString(),
        type: type,
      },
    },
  });   

  const linkProperties = {
    feature: 'sharing',
  };

  const { url } = await buo.generateShortUrl(linkProperties);
  console.log('Generated Branch Link:', url);
  return url;
};


