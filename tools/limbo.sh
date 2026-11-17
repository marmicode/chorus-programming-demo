#!/usr/bin/env bash

main() {
  while :; do
    git fetch -q
    [ "$(git rev-parse HEAD)" != "$(git rev-parse @{u})" ] && git pull --rebase --autostash && git push
    sync_notes
    # We don't need this to be super reactive, 5 seconds is fine.
    sleep 5
  done
}

sync_notes() {
  local NOTES=refs/notes/commits
  local REMOTE_NOTES=refs/notes/remote/origin/commits

  git fetch -q origin "+$NOTES:$REMOTE_NOTES" 2>/dev/null

  if git show-ref -q --verify "$REMOTE_NOTES"; then
    if git show-ref -q --verify "$NOTES"; then
      git notes merge -q -s cat_sort_uniq "$REMOTE_NOTES"
    else
      git update-ref "$NOTES" "$REMOTE_NOTES"
    fi
  fi

  [ "$(git rev-parse -q --verify "$NOTES")" != "$(git rev-parse -q --verify "$REMOTE_NOTES")" ] \
    && git push -q origin "$NOTES"
}

main "$@"