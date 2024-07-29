import React, { useRef, useEffect } from "react";
import styles from "./Notifications.module.css";

class Notifications {
  el: HTMLElement;

  constructor(el: HTMLElement) {
    this.el = el;
  }

  createDiv(className = ""): HTMLDivElement {
    const el = document.createElement("div");
    el.classList.add(className);
    return el;
  }

  addText(el: HTMLElement, text: string) {
    el.appendChild(document.createTextNode(text));
  }

  create(
    title = "Untitled notification",
    description = "",
    duration = 2,
    destroyOnClick = true,
    clickFunction?: () => void
  ) {
    const destroy = (animate: boolean) => {
      if (animate) {
        notiEl.classList.add(styles.out);
        notiEl.addEventListener("animationend", () => {
          notiEl.remove();
        });
      } else {
        notiEl.remove();
      }
    };

    const notiEl = this.createDiv(styles.noti);
    const notiCardEl = this.createDiv(styles.noticard);
    const glowEl = this.createDiv(styles.notiglow);
    const borderEl = this.createDiv(styles.notiborderglow);

    const titleEl = this.createDiv(styles.notititle);
    this.addText(titleEl, title);

    const descriptionEl = this.createDiv(styles.notidesc);
    this.addText(descriptionEl, description);

    notiEl.appendChild(notiCardEl);
    notiCardEl.appendChild(glowEl);
    notiCardEl.appendChild(borderEl);
    notiCardEl.appendChild(titleEl);
    notiCardEl.appendChild(descriptionEl);

    this.el.appendChild(notiEl);

    requestAnimationFrame(function () {
      notiEl.style.height =
        "calc(0.25rem + " + notiCardEl.getBoundingClientRect().height + "px)";
    });

    notiEl.addEventListener("mousemove", (event: MouseEvent) => {
      const rect = notiCardEl.getBoundingClientRect();
      const localX = (event.clientX - rect.left) / rect.width;
      const localY = (event.clientY - rect.top) / rect.height;

      glowEl.style.left = localX * 100 + "%";
      glowEl.style.top = localY * 100 + "%";

      borderEl.style.left = localX * 100 + "%";
      borderEl.style.top = localY * 100 + "%";
    });

    if (clickFunction != undefined) {
      notiEl.addEventListener("click", clickFunction);
    }

    if (destroyOnClick) {
      notiEl.addEventListener("click", () => destroy(true));
    }

    if (duration != 0) {
      setTimeout(() => {
        notiEl.classList.add(styles.out);
        notiEl.addEventListener("animationend", () => {
          notiEl.remove();
        });
      }, duration * 1000);
    }
    return notiEl;
  }
}

type NotificationDemoProps = {
  message: string;
};

const NotificationDemo: React.FC<NotificationDemoProps> = ({ message }) => {
  const notiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (notiRef.current && message) {
      const notis = new Notifications(notiRef.current);
      notis.create("Notification", message, 5);
    }
  }, [message]);

  return <div ref={notiRef} className={styles.notifications}></div>;
};

export default NotificationDemo;
