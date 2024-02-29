// This is copied from https://github.com/segmentio/analytics-next/tree/master/packages/browser#-using-as-an-npm-package
import { AnalyticsBrowser } from '@segment/analytics-next';

export const analytics = AnalyticsBrowser.load({ writeKey: 'MY_WRITE_KEY' });