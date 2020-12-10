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
 * environments or gets interpolated from env variables.
 */

const log = console;

type EnvironmentName = "prd" | "tst" | "ci" | "dev";

export interface EnvironmentConfig {
  isProd: boolean,
  environmentName: EnvironmentName,
  supabaseUrl: string,
}

function initConfig(){
  const newConfig = {
    ...sharedConfig,
    ...chooseEnvironmentConfig(process.env.REACT_APP_CABBAGE_ENV),
  };

  // don't print the key; it's not a secret, but it's ugly
  const {supabaseAnonKey, ...printConfig} = newConfig;
  log.debug("Application config",
    process.env.REACT_APP_CABBAGE_ENV, printConfig);
  return newConfig;
}

const sharedConfig = {
  buildDate: process.env.REACT_APP_BUILD_DATE_MS ||
    new Date().getTime().toString(),
  supabaseAnonKey: process.env.REACT_APP_SUPABASE_ANON_KEY,
  gitCommit: process.env.REACT_APP_COMMIT_REF ?? "unknown commit",
};


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

const ciConfig: EnvironmentConfig = {
  isProd: false,
  environmentName: "ci",
  supabaseUrl: "https://gbsobldqxhgoutktxwbb.supabase.co",
};

const stoDevDbUrl = "https://cqerjnimaqgfojrkpxcg.supabase.co";
const devConfig: EnvironmentConfig = {
  isProd: false,
  environmentName: "dev",
  supabaseUrl: process.env.REACT_APP_SUPBASE_DEV_URL ?? stoDevDbUrl,
};

const tstConfig: EnvironmentConfig = {
  isProd: false,
  environmentName: "tst",
  supabaseUrl: "https://wzoqznflznnxcszsdmkw.supabase.co",
};

const prdConfig: EnvironmentConfig = {
  isProd: true,
  environmentName: "prd",
  supabaseUrl: "https://othrpsywoabrbbqpuzjy.supabase.co",
};


export const Config: EnvironmentConfig & typeof sharedConfig = initConfig();

