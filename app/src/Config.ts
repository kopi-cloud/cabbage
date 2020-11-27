/** Helps manage configuration values across multiple environments.
 * <p>
 * The config values used by the app are decided when this file is run (i.e.
 * when the app is loaded into the browser), based on the value of
 * environmentName, which is provide at build time via the
 * REACT_APP_CABBAGE_ENV environment variable.
 * <p>
 * Config values are embedded into the raw client javascript artifact - it is
 * designed only for static, publicly visible config (i.e. not per user stuff
 * and definitely not secrets).
 * <p>
 * Config is not suitable for secrets like API keys or other sensitive data.
 * <p>
 * EnvironmentConfig is things we expect to change between environments,
 * whereas sharedConfig is stuff we usually expect to be the same across
 * environments.
 */

const log = console;

type EnvironmentName = "prd" | "tst" | "ci" | "dev";

export interface EnvironmentConfig {
  isProd: boolean,
  environmentName: EnvironmentName,
  supabaseUrl: string,
  supabaseAnonKey: string,
}

function initConfig(){
  const newConfig = {
    ...sharedConfig,
    ...chooseEnvironmentConfig(process.env.REACT_APP_CABBAGE_ENV),
  };
  log.debug("Application config", process.env.REACT_APP_CABBAGE_ENV, newConfig);
  return newConfig;
}

function chooseEnvironmentConfig(env: string | undefined){
  env = env?.toLowerCase();
  if( env === 'prd' ){
    return prdConfig
  }
  else if( env === 'tst' ){
    return tstConfig;
  }
  else if( env === 'ci' ){
    return ciConfig;
  }
  else {
    return devConfig;
  }
}

const sharedConfig = {
  buildDate: process.env.REACT_APP_BUILD_DATE_MS ||
    new Date().getTime().toString(),
};

const ciConfig: EnvironmentConfig = {
  isProd: false,
  environmentName: "ci",
  supabaseUrl: "https://sftsjtucvrgpeogudzge.supabase.co",
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYwNjM1MjAwOSwiZXhwIjoxOTIxOTI4MDA5fQ.VRllJt4THciauNzvVhfiD3C2NTOgP0iGmkz6wfhFhEk',
};

const devConfig: EnvironmentConfig = {
  isProd: false,
  environmentName: "dev",
  // wouldn't work in a team environment, but whatev's
  supabaseUrl: ciConfig.supabaseUrl,
  supabaseAnonKey: ciConfig.supabaseAnonKey,
};

const tstConfig: EnvironmentConfig = {
  isProd: false,
  environmentName: "tst",
  supabaseUrl: "https://vyqfnlxhctlvofaludro.supabase.co",
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYwNjM1MjA1NywiZXhwIjoxOTIxOTI4MDU3fQ.2Hy4zE9kT4x4EgJAWjvhW1k3H7UhWbOBHx5ZXFCtaGA',
};

const prdConfig: EnvironmentConfig = {
  isProd: true,
  environmentName: "prd",
  supabaseUrl: "https://othrpsywoabrbbqpuzjy.supabase.co",
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYwNjM1MjI0MCwiZXhwIjoxOTIxOTI4MjQwfQ.cwC2Va9FNLPkcIev6D613VgogDqmzR94uN3OgFjQ-hk',
};


export const Config: EnvironmentConfig & typeof sharedConfig = initConfig();

