import { useCallback, useEffect, useMemo, useState } from "react";

import { getMyInfo } from "@/features/my-page/personal-info/api/getMyInfo";
import { updateMyInfo } from "@/features/my-page/personal-info/api/updateMyInfo";
import { useUserStore } from "@/shared/store/userStore";

// 이메일은 로그인 ID라 서버가 수정하지 않으므로 편집 대상에서 뺀다.
export interface PersonalInfoDraft {
  name: string;
  nickname: string;
}

export const useMyInfo = () => {
  const name = useUserStore((state) => state.name);
  const nickname = useUserStore((state) => state.nickname);
  const email = useUserStore((state) => state.email);
  const isLoaded = useUserStore((state) => state.isLoaded);
  const setUser = useUserStore((state) => state.setUser);

  const [draftOverrides, setDraftOverrides] = useState<
    Partial<PersonalInfoDraft>
  >({});
  const [isFetching, setIsFetching] = useState(!isLoaded);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const draft = useMemo<PersonalInfoDraft>(
    () => ({
      name: draftOverrides.name ?? name,
      nickname: draftOverrides.nickname ?? nickname,
    }),
    [draftOverrides, name, nickname],
  );
  const isLoading = isFetching && !isLoaded;

  useEffect(() => {
    if (isLoaded) {
      return;
    }

    let isActive = true;

    void getMyInfo().then(({ data, errorMessage: loadErrorMessage }) => {
      if (!isActive) {
        return;
      }

      if (loadErrorMessage || !data) {
        setErrorMessage(
          loadErrorMessage || "회원 정보를 불러오지 못했습니다.",
        );
        setIsFetching(false);
        return;
      }

      setUser(data);
      setIsFetching(false);
    });

    return () => {
      isActive = false;
    };
  }, [isLoaded, setUser]);

  const handleFieldChange = (field: keyof PersonalInfoDraft, value: string) => {
    setDraftOverrides((previousDraft) => ({
      ...previousDraft,
      [field]: value,
    }));
    setErrorMessage("");
    setSaveMessage("");
  };

  const handleSave = useCallback(async () => {
    if (isSaving) {
      return;
    }

    const nextDraft = {
      name: draft.name.trim(),
      nickname: draft.nickname.trim(),
    };

    if (!nextDraft.name || !nextDraft.nickname) {
      setErrorMessage("이름과 닉네임을 모두 입력해주세요.");
      setSaveMessage("");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSaveMessage("");

    const { errorMessage: saveErrorMessage } = await updateMyInfo(nextDraft);

    if (saveErrorMessage) {
      setIsSaving(false);
      setErrorMessage(saveErrorMessage);
      return;
    }

    // 저장은 성공했으므로 재조회가 실패하면 입력값으로 대신 갱신한다.
    const { data: savedUser } = await getMyInfo();

    setIsSaving(false);
    setUser(savedUser ?? nextDraft);
    setDraftOverrides({});
    setSaveMessage("개인정보가 저장되었습니다.");
  }, [draft, isSaving, setUser]);

  return {
    draft,
    email,
    errorMessage,
    isLoading,
    isSaving,
    onFieldChange: handleFieldChange,
    onSave: handleSave,
    saveMessage,
  };
};
