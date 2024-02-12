import compileHTML from './utils';
/**
 * Class for create infinite scrolling (lazy loading) of images in a page - deferred fetching of images until the user
 * scrolls near the end of the list.
 * 
 */

interface InfiniteScrollingOptions {
    callback: () => Promise<any>, 
    targetElementClass: string, 
    insertContainer: string,
    template: string,
}

export class InfiniteScrolling {
    private targetElement: Element | null;
    private insertContainer: Element | null;
    private fetchData: () => Promise<any>;
    private observer!: IntersectionObserver;
    private template: string;

    constructor({callback, targetElementClass, insertContainer, template}: InfiniteScrollingOptions) {
        this.targetElement = document.querySelector(targetElementClass);
        this.insertContainer = document.querySelector(insertContainer);
        this.fetchData = callback;
        this.template = template;
    }

    initialize() {
        this.createObserver();
        this.subscribe();
    }

    createObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.4
        };

        this.observer = new IntersectionObserver(this.handlerIntersection.bind(this), options);
    }

    subscribe() {
        if (this.targetElement) this.observer.observe(this.targetElement);
    }

    handlerIntersection(entries: IntersectionObserverEntry[]) {
        if (entries[0].intersectionRatio <= 0) {
            return;
        }

        this.loadItems().then(items => {
            items.forEach((item: any) => {
                const newItem = this.createNewItem(item);
                this.printNewItem(newItem);
            })
        });
    }

    loadItems() {
        return this.fetchData()
            .then(resp => resp.json())
            .catch(e => console.error(e));
    }

    createNewItem(params: any) {
        return () => compileHTML(this.template, params);
    }

    printNewItem(newItem: any) {
        this.insertContainer?.insertAdjacentHTML('beforeend', newItem);
    }

    unsubscribe() {
        this.observer.disconnect();
    }
}