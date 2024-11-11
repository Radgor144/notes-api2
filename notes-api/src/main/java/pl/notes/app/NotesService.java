package pl.notes.app;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import pl.notes.app.exceptions.NoteNotFoundException;
import pl.notes.model.Note;
import pl.notes.model.NoteCreateRequest;
import pl.notes.model.NotePage;
import pl.notes.model.NoteUpdateRequest;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotesService {

    private final NotesRepository notesRepository;

    public Note notesPost(NoteCreateRequest noteCreateRequest) {
        NoteEntity noteEntityToSave = new NoteEntity();

        noteEntityToSave.setContent(noteCreateRequest.getContent());
        noteEntityToSave.setTitle(noteCreateRequest.getTitle());
        noteEntityToSave.setCreatedAt(OffsetDateTime.now());

        NoteEntity savedNoteEntity = notesRepository.save(noteEntityToSave);
        return mapNoteEntityToNote(savedNoteEntity);
    }

    public NotePage notesGet(Integer page, Integer size, String sort, String direction) {

        Sort.Direction sortDirection = Sort.Direction.fromString(direction);

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDirection, sort));

        Page<NoteEntity> notesPage = notesRepository.findAll(pageRequest);

        return new NotePage()
                .content(getContent(notesPage))
                .page(notesPage.getNumber())
                .size(notesPage.getSize())
                .totalElements(notesPage.getTotalElements())
                .totalPages(notesPage.getTotalPages());
    }

    public void notesIdDelete(UUID id) {
        NoteEntity noteEntity = findNoteEntityById(id);
        notesRepository.delete(noteEntity);
    }

    public Note notesIdGet(UUID id) {
        NoteEntity noteEntity = findNoteEntityById(id);
        return mapNoteEntityToNote(noteEntity);
    }

    public Note notesIdPut(UUID id, NoteUpdateRequest noteUpdateRequest) {
        NoteEntity noteEntity = findNoteEntityById(id);

        noteEntity.setTitle(noteUpdateRequest.getTitle());
        noteEntity.setContent(noteUpdateRequest.getContent());

        NoteEntity updatedNoteEntity = notesRepository.save(noteEntity);

        return mapNoteEntityToNote(updatedNoteEntity);
    }


    private static List<Note> getContent(Page<NoteEntity> notesPage) {
        return notesPage.getContent()
                .stream()
                .map(NotesService::mapNoteEntityToNote)
                .toList();
    }

    private static Note mapNoteEntityToNote(NoteEntity noteEntity) {
        return new Note()
                .id(noteEntity.getId())
                .content(noteEntity.getContent())
                .title(noteEntity.getTitle())
                .createdAt(noteEntity.getCreatedAt());
    }

    private NoteEntity findNoteEntityById(UUID id) {
        return notesRepository.findById(id)
                .orElseThrow(() -> new NoteNotFoundException("Note with ID " + id + " not found"));
    }


}
