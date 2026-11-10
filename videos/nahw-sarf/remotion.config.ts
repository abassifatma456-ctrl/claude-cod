import {Config} from '@remotion/cli/config';

// Use the Chromium headless shell that is preinstalled in this environment.
Config.setBrowserExecutable(
  '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
);
Config.setVideoImageFormat('jpeg');
Config.setConcurrency(4);
