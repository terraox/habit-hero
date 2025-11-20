package com.example.habithero.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "habits")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Habit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String icon;
    private String frequency;

    // active flag
    @Builder.Default
    private boolean active = true;

    // owner relationship
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    // store done dates as element collection of LocalDate
    @ElementCollection
    @CollectionTable(name = "habit_done_dates", joinColumns = @JoinColumn(name = "habit_id"))
    @Column(name = "done_date")
    @Builder.Default
    private List<LocalDate> doneDates = new ArrayList<>();

    // convenience: add a done date
    public void addDoneDate(LocalDate date) {
        if (this.doneDates == null) this.doneDates = new ArrayList<>();
        this.doneDates.add(date);
    }
}