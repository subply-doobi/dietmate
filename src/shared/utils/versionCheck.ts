export const checkIsUpToDate = ({
  appVersion,
  latestVersion,
}: {
  appVersion: string;
  latestVersion: string;
}) => {
  const versionArray = (version: string) => version.split('.').map(Number);

  const clientVersionArray = versionArray(appVersion);
  const latestVersionArray = versionArray(latestVersion);

  // Compare major and minor versions
  if (
    clientVersionArray[0] < latestVersionArray[0] ||
    (clientVersionArray[0] === latestVersionArray[0] &&
      clientVersionArray[1] < latestVersionArray[1])
  ) {
    return {
      isUpToDate: false,
      message: `Major or minor version is outdated. Please update your app. (Current: ${appVersion}, Latest: ${latestVersion})`,
    };
  }

  // Compare patch versions
  if (clientVersionArray[2] < latestVersionArray[2]) {
    return {
      isUpToDate: true,
      message: `Patch version is outdated, but no alert needed. (Current: ${appVersion}, Latest: ${latestVersion})`,
    };
  }

  return {
    isUpToDate: true,
    message: `Client app is up-to-date. (Current: ${appVersion}, Latest: ${latestVersion})`,
  };
};
