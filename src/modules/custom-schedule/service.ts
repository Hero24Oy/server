import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

import { CronJobCallback } from './types';

import { MaybeType } from '$modules/common/common.types';

@Injectable()
export class CustomScheduleService {
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  createCronJob(name: string, cron: string, callback: CronJobCallback): void {
    const job = new CronJob(cron, () => {
      void callback();
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }

  getLastJobDate(name: string): MaybeType<Date> {
    const job = this.schedulerRegistry.getCronJob(name);

    return job.lastDate();
  }
}
