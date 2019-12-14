import PodJob from './PodJob';

export default class ScalePodsJob extends PodJob {
  prepare(bundle) {
    super.prepare(bundle);
    this.scaleTo = bundle.scaleTo;
  }

  toKapiPayload() {
    return {
      ...super.toKapiPayload(),
      scaleTo: this.scaleTo,
    };
  }

  recomputeState() {
    const runCountGood = this.runningPods().length === this.scaleTo;

    if (this.isUpScale()) {
      if (this.crashedPods().length > 0) {
        this.conclude(false, 'Pod Failures in New Pods');
      } else if (runCountGood) this.conclude(true);
    } else if (runCountGood) {
      if (this.deadPods().length === -this.deltaCount()) this.conclude(true);
    }
  }

  deltaCount() {
    return this.scaleTo - this.initial.length;
  }

  isUpScale() {
    return this.deltaCount() > 0;
  }

  progressItems() {
    const deadCount = this.deadPods().length;
    const newPods = this.newPods();
    const running = this.runningPods(newPods);

    if (this.isUpScale()) {
      return [
        this.buildProgressItem(
          'New pods created',
          `${newPods.length}/${this.deltaCount()}`,
          this.simpleStatus(newPods.length === this.deltaCount()),
        ),
        this.buildProgressItem(
          'New pods running',
          `${running.length}/${this.deltaCount()}`,
          this.simpleStatus(running.length === this.deltaCount()),
        ),
      ];
    }
    return [
      this.buildProgressItem(
        'Unwanted pods killed',
        `${deadCount}/${-this.deltaCount()}`,
        this.simpleStatus(deadCount === -this.deltaCount()),
      ),
    ];
  }

  kapiVerb() {
    return 'scale_replicas';
  }
}
